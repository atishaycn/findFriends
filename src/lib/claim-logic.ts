import type { ConnectionKind, InviteStatus, RoundStatus } from "@/lib/types";
import { AppError } from "@/lib/errors";

export type ExistingParticipantOutcome =
  | "self_claim"
  | "immediate_return"
  | "closing_loop";

export type ClaimDecision =
  | {
      type: "joined";
      inviteStatus: InviteStatus;
      connectionKind: ConnectionKind;
      requiresNewParticipant: true;
      lockPendingInvites: false;
    }
  | {
      type: "self_claim" | "immediate_return";
      inviteStatus: InviteStatus;
      requiresNewParticipant: false;
      lockPendingInvites: false;
    }
  | {
      type: "round_complete";
      inviteStatus: InviteStatus;
      connectionKind: ConnectionKind;
      requiresNewParticipant: false;
      lockPendingInvites: true;
    }
  | {
      type: "round_already_complete";
      inviteStatus: InviteStatus;
      requiresNewParticipant: false;
      lockPendingInvites: true;
    };

export function resolveExistingParticipantOutcome(input: {
  inviterParticipantId: string;
  inviterParentParticipantId: string | null;
  existingParticipantId: string;
}): ExistingParticipantOutcome {
  if (input.existingParticipantId === input.inviterParticipantId) {
    return "self_claim";
  }

  if (
    input.inviterParentParticipantId &&
    input.existingParticipantId === input.inviterParentParticipantId
  ) {
    return "immediate_return";
  }

  return "closing_loop";
}

export function resolveClaimDecision(input: {
  roundStatus: RoundStatus;
  inviterParticipantId: string;
  inviterParentParticipantId: string | null;
  claimantParticipantId: string | null;
  displayName?: string;
  isDisplayNameAvailable?: boolean;
}): ClaimDecision {
  if (input.roundStatus === "completed") {
    return {
      type: "round_already_complete",
      inviteStatus: "locked",
      requiresNewParticipant: false,
      lockPendingInvites: true,
    };
  }

  if (!input.claimantParticipantId) {
    if (!input.displayName) {
      throw new AppError(
        "Display name is required to join a round.",
        400,
        "display_name_required",
      );
    }

    if (!input.isDisplayNameAvailable) {
      throw new AppError(
        "That display name is already taken in this round.",
        409,
        "duplicate_display_name",
      );
    }

    return {
      type: "joined",
      inviteStatus: "claimed",
      connectionKind: "tree",
      requiresNewParticipant: true,
      lockPendingInvites: false,
    };
  }

  const outcome = resolveExistingParticipantOutcome({
    inviterParticipantId: input.inviterParticipantId,
    inviterParentParticipantId: input.inviterParentParticipantId,
    existingParticipantId: input.claimantParticipantId,
  });

  if (outcome === "self_claim") {
    return {
      type: "self_claim",
      inviteStatus: "blocked_return",
      requiresNewParticipant: false,
      lockPendingInvites: false,
    };
  }

  if (outcome === "immediate_return") {
    return {
      type: "immediate_return",
      inviteStatus: "blocked_return",
      requiresNewParticipant: false,
      lockPendingInvites: false,
    };
  }

  return {
    type: "round_complete",
    inviteStatus: "claimed",
    connectionKind: "closing_loop",
    requiresNewParticipant: false,
    lockPendingInvites: true,
  };
}

export function assertFinalGraphAvailable(input: {
  roundStatus: RoundStatus;
  completedAt: string | null;
}) {
  return input.roundStatus === "completed" && Boolean(input.completedAt);
}
