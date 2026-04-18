export type RoundStatus = "active" | "completed";
export type InviteStatus = "pending" | "claimed" | "blocked_return" | "locked";
export type ConnectionKind = "tree" | "closing_loop";

export interface RoundSummary {
  slug: string;
  status: RoundStatus;
  prompt: string | null;
  createdAt: string;
  completedAt: string | null;
  myDisplayName: string;
  totalParticipants: number;
  invitesSent: number;
  roundUrl: string;
  graphUrl: string;
}

export interface WorkspaceInvite {
  id: string;
  token: string;
  status: InviteStatus;
  createdAt: string;
  claimedAt: string | null;
  claimedByDisplayName: string | null;
  shareUrl: string;
}

export interface RoundWorkspaceData {
  slug: string;
  status: RoundStatus;
  prompt: string | null;
  createdAt: string;
  completedAt: string | null;
  isStarter: boolean;
  totalParticipants: number;
  pendingInvites: number;
  participant: {
    id: string;
    displayName: string;
    parentParticipantId: string | null;
    parentDisplayName: string | null;
  };
  invites: WorkspaceInvite[];
  roundUrl: string;
  graphUrl: string;
}

export interface InvitePreview {
  token: string;
  inviteStatus: InviteStatus;
  roundStatus: RoundStatus;
  roundSlug: string;
  prompt: string | null;
  inviterDisplayName: string;
  viewerParticipantId: string | null;
  viewerDisplayName: string | null;
  shareUrl: string;
}

export interface GraphNode {
  id: string;
  label: string;
  parentId: string | null;
  isStarter: boolean;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  kind: ConnectionKind;
  isCompletion: boolean;
}

export interface FinalGraphData {
  slug: string;
  prompt: string | null;
  completedAt: string;
  startedAt: string;
  starterDisplayName: string;
  closerDisplayName: string | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CompletionRecipient {
  email: string;
  displayName: string;
}

export type ClaimInviteResult =
  | {
      type: "joined";
      roundSlug: string;
      participantDisplayName: string;
    }
  | {
      type: "immediate_return";
      roundSlug: string;
      participantDisplayName: string;
      inviterDisplayName: string;
    }
  | {
      type: "self_claim";
      roundSlug: string;
      participantDisplayName: string;
    }
  | {
      type: "round_complete";
      roundSlug: string;
      closerDisplayName: string;
      inviterDisplayName: string;
      recipients: CompletionRecipient[];
    }
  | {
      type: "round_already_complete";
      roundSlug: string;
    };

export interface ApiErrorPayload {
  error: string;
  code?: string;
}
