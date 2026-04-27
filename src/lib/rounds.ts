import type { User } from "@supabase/supabase-js";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { getBaseUrl } from "@/lib/env";
import { sendCompletionEmails } from "@/lib/email";
import { resolveExistingParticipantOutcome } from "@/lib/claim-logic";
import { invitePath, roundGraphPath, roundPath } from "@/lib/routes";
import type {
  ClaimInviteResult,
  CompletionRecipient,
  FinalGraphData,
  InvitePreview,
  RoundSummary,
  RoundWorkspaceData,
  WorkspaceInvite,
} from "@/lib/types";
import {
  absoluteUrl,
  generateInviteToken,
  generatePublicSlug,
  isUniqueViolation,
  normalizeDisplayName,
} from "@/lib/utils";

const displayNameSchema = z
  .string()
  .trim()
  .transform(normalizeDisplayName)
  .pipe(z.string().min(2).max(24));

export const createRoundSchema = z.object({
  displayName: displayNameSchema,
});

export const createInviteSchema = z.object({
  roundSlug: z.string().regex(/^[a-z0-9]{8}$/),
});

export const claimInviteSchema = z.object({
  displayName: displayNameSchema.optional(),
});

type RoundRow = {
  id: string;
  slug: string;
  status: "active" | "completed";
  completed_at: string | null;
  created_at: string;
};

type ParticipantRow = {
  id: string;
  display_name: string;
};

type RoundSummaryRow = {
  slug: string;
  status: "active" | "completed";
  completed_at: string | null;
  created_at: string;
  my_display_name: string;
  total_participants: number;
  invites_sent: number;
};

type WorkspaceRow = {
  round_id: string;
  slug: string;
  status: "active" | "completed";
  completed_at: string | null;
  created_at: string;
  starter_participant_id: string | null;
  participant_id: string;
  display_name: string;
  parent_participant_id: string | null;
  parent_display_name: string | null;
  total_participants: number;
  pending_invites: number;
};

type InviteRow = {
  id: string;
  token: string;
  status: "pending" | "claimed" | "blocked_return" | "locked";
  created_at: string;
  claimed_at: string | null;
  claimed_by_display_name: string | null;
};

type InviteContextRow = {
  invite_id: string;
  invite_status: "pending" | "claimed" | "blocked_return" | "locked";
  round_id: string;
  round_slug: string;
  round_status: "active" | "completed";
  inviter_participant_id: string;
  inviter_display_name: string;
  inviter_parent_participant_id: string | null;
};

type GraphNodeRow = {
  id: string;
  display_name: string;
  parent_participant_id: string | null;
  is_starter: boolean;
};

type GraphEdgeRow = {
  id: string;
  source_id: string;
  target_id: string;
  kind: "tree" | "closing_loop";
  is_completion: boolean;
};

type CompletionRow = {
  email: string;
  display_name: string;
};

function buildWorkspaceInvite(baseUrl: string, row: InviteRow): WorkspaceInvite {
  return {
    id: row.id,
    token: row.token,
    status: row.status,
    createdAt: row.created_at,
    claimedAt: row.claimed_at,
    claimedByDisplayName: row.claimed_by_display_name,
    shareUrl: absoluteUrl(baseUrl, invitePath(row.token)),
  };
}

function assertEmail(user: User) {
  if (!user.email) {
    throw new Error("Authenticated users must have an email address.");
  }

  return user.email;
}

export async function createRoundForUser(user: User, input: { displayName: string }) {
  const { displayName } = createRoundSchema.parse(input);
  const email = assertEmail(user);
  const db = getDb();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const slug = generatePublicSlug();

    try {
      return await db.begin(async (tx) => {
        const [round] = await tx<RoundRow[]>`
          insert into rounds (slug)
          values (${slug})
          returning id, slug, status, completed_at, created_at
        `;

        const [starter] = await tx<ParticipantRow[]>`
          insert into participants (round_id, auth_user_id, display_name, email)
          values (${round.id}, ${user.id}::uuid, ${displayName}, ${email})
          returning id, display_name
        `;

        await tx`
          update rounds
          set starter_participant_id = ${starter.id}::uuid
          where id = ${round.id}::uuid
        `;

        return {
          slug: round.slug,
          participantDisplayName: starter.display_name,
        };
      });
    } catch (error) {
      if (isUniqueViolation(error, "rounds_slug_key")) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not generate a unique round slug.");
}

export async function listUserRounds(userId: string, baseUrl = getBaseUrl()) {
  const db = getDb();
  const rows = await db<RoundSummaryRow[]>`
    select
      r.slug,
      r.status,
      r.completed_at,
      r.created_at,
      p.display_name as my_display_name,
      (
        select count(*)::int
        from participants grouped_participants
        where grouped_participants.round_id = r.id
      ) as total_participants,
      (
        select count(*)::int
        from invites grouped_invites
        where grouped_invites.inviter_participant_id = p.id
      ) as invites_sent
    from participants p
    join rounds r on r.id = p.round_id
    where p.auth_user_id = ${userId}::uuid
    order by r.created_at desc
  `;

  return rows.map<RoundSummary>((row) => ({
    slug: row.slug,
    status: row.status,
    createdAt: row.created_at,
    completedAt: row.completed_at,
    myDisplayName: row.my_display_name,
    totalParticipants: row.total_participants,
    invitesSent: row.invites_sent,
    roundUrl: absoluteUrl(baseUrl, roundPath(row.slug)),
    graphUrl: absoluteUrl(baseUrl, roundGraphPath(row.slug)),
  }));
}

export async function getRoundWorkspace(
  slug: string,
  userId: string,
  baseUrl = getBaseUrl(),
) {
  const db = getDb();
  const [workspace] = await db<WorkspaceRow[]>`
    select
      r.id as round_id,
      r.slug,
      r.status,
      r.completed_at,
      r.created_at,
      r.starter_participant_id,
      p.id as participant_id,
      p.display_name,
      p.parent_participant_id,
      parent.display_name as parent_display_name,
      (
        select count(*)::int
        from participants grouped_participants
        where grouped_participants.round_id = r.id
      ) as total_participants,
      (
        select count(*)::int
        from invites grouped_invites
        where grouped_invites.round_id = r.id
          and grouped_invites.status = 'pending'
      ) as pending_invites
    from rounds r
    join participants p on p.round_id = r.id
    left join participants parent on parent.id = p.parent_participant_id
    where r.slug = ${slug}
      and p.auth_user_id = ${userId}::uuid
    limit 1
  `;

  if (!workspace) {
    return null;
  }

  const invites = await db<InviteRow[]>`
    select
      i.id,
      i.token,
      i.status,
      i.created_at,
      i.claimed_at,
      claimed.display_name as claimed_by_display_name
    from invites i
    left join participants claimed on claimed.id = i.claimed_by_participant_id
    where i.inviter_participant_id = ${workspace.participant_id}::uuid
    order by i.created_at desc
  `;

  const roundUrl = absoluteUrl(baseUrl, roundPath(workspace.slug));
  const graphUrl = absoluteUrl(baseUrl, roundGraphPath(workspace.slug));

  return {
    slug: workspace.slug,
    status: workspace.status,
    createdAt: workspace.created_at,
    completedAt: workspace.completed_at,
    isStarter: workspace.starter_participant_id === workspace.participant_id,
    totalParticipants: workspace.total_participants,
    pendingInvites: workspace.pending_invites,
    participant: {
      id: workspace.participant_id,
      displayName: workspace.display_name,
      parentParticipantId: workspace.parent_participant_id,
      parentDisplayName: workspace.parent_display_name,
    },
    invites: invites.map((invite) => buildWorkspaceInvite(baseUrl, invite)),
    roundUrl,
    graphUrl,
  } satisfies RoundWorkspaceData;
}

export async function getInvitePreview(
  token: string,
  viewerUserId?: string,
  baseUrl = getBaseUrl(),
) {
  const db = getDb();
  const rows = await db<
    Array<{
      token: string;
      invite_status: "pending" | "claimed" | "blocked_return" | "locked";
      round_status: "active" | "completed";
      round_slug: string;
      inviter_display_name: string;
      viewer_participant_id: string | null;
      viewer_display_name: string | null;
    }>
  >`
    select
      i.token,
      i.status as invite_status,
      r.status as round_status,
      r.slug as round_slug,
      inviter.display_name as inviter_display_name,
      viewer.id as viewer_participant_id,
      viewer.display_name as viewer_display_name
    from invites i
    join rounds r on r.id = i.round_id
    join participants inviter on inviter.id = i.inviter_participant_id
    left join participants viewer
      on viewer.round_id = r.id
      and viewer.auth_user_id = ${viewerUserId ?? null}::uuid
    where i.token = ${token}
    limit 1
  `;

  const invite = rows[0];

  if (!invite) {
    return null;
  }

  return {
    token: invite.token,
    inviteStatus: invite.invite_status,
    roundStatus: invite.round_status,
    roundSlug: invite.round_slug,
    inviterDisplayName: invite.inviter_display_name,
    viewerParticipantId: invite.viewer_participant_id,
    viewerDisplayName: invite.viewer_display_name,
    shareUrl: absoluteUrl(baseUrl, invitePath(invite.token)),
  } satisfies InvitePreview;
}

export async function createInviteForUser(
  userId: string,
  input: { roundSlug: string },
  baseUrl = getBaseUrl(),
) {
  const { roundSlug } = createInviteSchema.parse(input);
  const db = getDb();
  const [participant] = await db<
    Array<{
      round_id: string;
      participant_id: string;
      round_status: "active" | "completed";
    }>
  >`
    select
      r.id as round_id,
      p.id as participant_id,
      r.status as round_status
    from rounds r
    join participants p on p.round_id = r.id
    where r.slug = ${roundSlug}
      and p.auth_user_id = ${userId}::uuid
    limit 1
  `;

  if (!participant) {
    throw new Error("Round not found for this user.");
  }

  if (participant.round_status !== "active") {
    throw new Error("This round is already complete.");
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const token = generateInviteToken();

    try {
      const [invite] = await db<InviteRow[]>`
        insert into invites (round_id, inviter_participant_id, token)
        values (
          ${participant.round_id}::uuid,
          ${participant.participant_id}::uuid,
          ${token}
        )
        returning id, token, status, created_at, claimed_at, null::text as claimed_by_display_name
      `;

      const shareUrl = absoluteUrl(baseUrl, invitePath(invite.token));

      return {
        invite: buildWorkspaceInvite(baseUrl, invite),
        shareMessage: `Join my friend graph and claim your spot: ${shareUrl}`,
      };
    } catch (error) {
      if (isUniqueViolation(error, "invites_token_key")) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Could not generate a unique invite token.");
}

export async function claimInviteForUser(
  user: User,
  token: string,
  input: { displayName?: string },
) {
  const parsed = claimInviteSchema.parse(input);
  const email = assertEmail(user);
  const db = getDb();

  const result = await db.begin(async (tx) => {
    const [invite] = await tx<InviteContextRow[]>`
      select
        i.id as invite_id,
        i.status as invite_status,
        i.round_id,
        r.slug as round_slug,
        r.status as round_status,
        inviter.id as inviter_participant_id,
        inviter.display_name as inviter_display_name,
        inviter.parent_participant_id as inviter_parent_participant_id
      from invites i
      join rounds r on r.id = i.round_id
      join participants inviter on inviter.id = i.inviter_participant_id
      where i.token = ${token}
      for update of i
    `;

    if (!invite) {
      throw new Error("Invite not found.");
    }

    const [lockedRound] = await tx<RoundRow[]>`
      select id, slug, status, completed_at, created_at
      from rounds
      where id = ${invite.round_id}::uuid
      for update
    `;

    if (!lockedRound) {
      throw new Error("Round not found.");
    }

    if (lockedRound.status === "completed") {
      if (invite.invite_status === "pending") {
        await tx`
          update invites
          set status = 'locked'
          where id = ${invite.invite_id}::uuid
            and status = 'pending'
        `;
      }

      return {
        type: "round_already_complete",
        roundSlug: invite.round_slug,
      } satisfies ClaimInviteResult;
    }

    if (invite.invite_status !== "pending") {
      throw new Error("This invite has already been used.");
    }

    const [existingParticipant] = await tx<
      Array<{
        id: string;
        display_name: string;
      }>
    >`
      select id, display_name
      from participants
      where round_id = ${invite.round_id}::uuid
        and auth_user_id = ${user.id}::uuid
      limit 1
      for update
    `;

    if (!existingParticipant) {
      if (!parsed.displayName) {
        throw new Error("Display name is required to join a round.");
      }

      try {
        const [participant] = await tx<ParticipantRow[]>`
          insert into participants (
            round_id,
            auth_user_id,
            display_name,
            email,
            parent_participant_id
          )
          values (
            ${invite.round_id}::uuid,
            ${user.id}::uuid,
            ${parsed.displayName},
            ${email},
            ${invite.inviter_participant_id}::uuid
          )
          returning id, display_name
        `;

        await tx`
          insert into connections (
            round_id,
            from_participant_id,
            to_participant_id,
            kind
          )
          values (
            ${invite.round_id}::uuid,
            ${invite.inviter_participant_id}::uuid,
            ${participant.id}::uuid,
            'tree'
          )
        `;

        await tx`
          update invites
          set
            status = 'claimed',
            claimed_by_participant_id = ${participant.id}::uuid,
            claimed_at = now()
          where id = ${invite.invite_id}::uuid
        `;

        return {
          type: "joined",
          roundSlug: invite.round_slug,
          participantDisplayName: participant.display_name,
        } satisfies ClaimInviteResult;
      } catch (error) {
        if (isUniqueViolation(error, "participants_round_lower_display_name_idx")) {
          throw new Error("That display name is already taken in this round.");
        }

        throw error;
      }
    }

    const outcome = resolveExistingParticipantOutcome({
      inviterParticipantId: invite.inviter_participant_id,
      inviterParentParticipantId: invite.inviter_parent_participant_id,
      existingParticipantId: existingParticipant.id,
    });

    if (outcome === "self_claim" || outcome === "immediate_return") {
      await tx`
        update invites
        set
          status = 'blocked_return',
          claimed_by_participant_id = ${existingParticipant.id}::uuid,
          claimed_at = now()
        where id = ${invite.invite_id}::uuid
      `;

      if (outcome === "self_claim") {
        return {
          type: "self_claim",
          roundSlug: invite.round_slug,
          participantDisplayName: existingParticipant.display_name,
        } satisfies ClaimInviteResult;
      }

      return {
        type: "immediate_return",
        roundSlug: invite.round_slug,
        participantDisplayName: existingParticipant.display_name,
        inviterDisplayName: invite.inviter_display_name,
      } satisfies ClaimInviteResult;
    }

    const [completionConnection] = await tx<Array<{ id: string }>>`
      insert into connections (
        round_id,
        from_participant_id,
        to_participant_id,
        kind
      )
      values (
        ${invite.round_id}::uuid,
        ${invite.inviter_participant_id}::uuid,
        ${existingParticipant.id}::uuid,
        'closing_loop'
      )
      returning id
    `;

    await tx`
      update rounds
      set
        status = 'completed',
        completed_at = now(),
        completion_connection_id = ${completionConnection.id}::uuid
      where id = ${invite.round_id}::uuid
    `;

    await tx`
      update invites
      set
        status = 'claimed',
        claimed_by_participant_id = ${existingParticipant.id}::uuid,
        claimed_at = now()
      where id = ${invite.invite_id}::uuid
    `;

    await tx`
      update invites
      set status = 'locked'
      where round_id = ${invite.round_id}::uuid
        and status = 'pending'
        and id <> ${invite.invite_id}::uuid
    `;

    const recipients = await tx<CompletionRow[]>`
      select email, display_name
      from participants
      where round_id = ${invite.round_id}::uuid
      order by created_at asc
    `;

    return {
      type: "round_complete",
      roundSlug: invite.round_slug,
      closerDisplayName: existingParticipant.display_name,
      inviterDisplayName: invite.inviter_display_name,
      recipients: recipients.map<CompletionRecipient>((recipient) => ({
        email: recipient.email,
        displayName: recipient.display_name,
      })),
    } satisfies ClaimInviteResult;
  });

  if (result.type === "round_complete") {
    await sendCompletionEmails({
      roundSlug: result.roundSlug,
      recipients: result.recipients,
    });
  }

  return result;
}

export async function getFinalGraph(
  slug: string,
  userId: string,
) {
  const db = getDb();

  const [roundAccess] = await db<
    Array<{
      round_id: string;
      completed_at: string | null;
      status: "active" | "completed";
    }>
  >`
    select
      r.id as round_id,
      r.completed_at,
      r.status
    from rounds r
    join participants p on p.round_id = r.id
    where r.slug = ${slug}
      and p.auth_user_id = ${userId}::uuid
    limit 1
  `;

  if (!roundAccess) {
    return null;
  }

  if (roundAccess.status !== "completed" || !roundAccess.completed_at) {
    return "pending" as const;
  }

  const nodes = await db<GraphNodeRow[]>`
    select
      p.id,
      p.display_name,
      p.parent_participant_id,
      (p.id = r.starter_participant_id) as is_starter
    from participants p
    join rounds r on r.id = p.round_id
    where r.id = ${roundAccess.round_id}::uuid
    order by p.created_at asc
  `;

  const edges = await db<GraphEdgeRow[]>`
    select
      c.id,
      c.from_participant_id as source_id,
      c.to_participant_id as target_id,
      c.kind,
      (c.id = r.completion_connection_id) as is_completion
    from connections c
    join rounds r on r.id = c.round_id
    where c.round_id = ${roundAccess.round_id}::uuid
    order by c.created_at asc
  `;

  return {
    slug,
    completedAt: roundAccess.completed_at,
    nodes: nodes.map((node) => ({
      id: node.id,
      label: node.display_name,
      parentId: node.parent_participant_id,
      isStarter: node.is_starter,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sourceId: edge.source_id,
      targetId: edge.target_id,
      kind: edge.kind,
      isCompletion: edge.is_completion,
    })),
  } satisfies FinalGraphData;
}
