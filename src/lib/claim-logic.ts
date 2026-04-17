export type ExistingParticipantOutcome =
  | "self_claim"
  | "immediate_return"
  | "closing_loop";

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
