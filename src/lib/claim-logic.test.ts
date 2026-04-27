import { describe, expect, it } from "vitest";
import { resolveExistingParticipantOutcome } from "@/lib/claim-logic";
import { normalizeDisplayName } from "@/lib/utils";

describe("resolveExistingParticipantOutcome", () => {
  it("flags self-claims so a sender cannot close their own loop", () => {
    expect(
      resolveExistingParticipantOutcome({
        inviterParticipantId: "a",
        inviterParentParticipantId: "root",
        existingParticipantId: "a",
      }),
    ).toBe("self_claim");
  });

  it("flags immediate returns to the inviter parent as warnings", () => {
    expect(
      resolveExistingParticipantOutcome({
        inviterParticipantId: "b",
        inviterParentParticipantId: "a",
        existingParticipantId: "a",
      }),
    ).toBe("immediate_return");
  });

  it("treats any other earlier participant as a valid closing loop", () => {
    expect(
      resolveExistingParticipantOutcome({
        inviterParticipantId: "d",
        inviterParentParticipantId: "c",
        existingParticipantId: "a",
      }),
    ).toBe("closing_loop");
  });
});

describe("normalizeDisplayName", () => {
  it("collapses duplicate whitespace while preserving the readable name", () => {
    expect(normalizeDisplayName("  Friend    A  ")).toBe("Friend A");
  });
});
