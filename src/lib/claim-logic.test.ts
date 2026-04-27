import { describe, expect, it } from "vitest";
import {
  assertFinalGraphAvailable,
  resolveClaimDecision,
  resolveExistingParticipantOutcome,
} from "@/lib/claim-logic";
import { AppError } from "@/lib/errors";
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

describe("resolveClaimDecision", () => {
  it("returns joined for a new participant and records a tree edge", () => {
    expect(
      resolveClaimDecision({
        roundStatus: "active",
        inviterParticipantId: "b",
        inviterParentParticipantId: "a",
        claimantParticipantId: null,
        displayName: "Ava Stone",
        isDisplayNameAvailable: true,
      }),
    ).toEqual({
      type: "joined",
      inviteStatus: "claimed",
      connectionKind: "tree",
      requiresNewParticipant: true,
      lockPendingInvites: false,
    });
  });

  it("completes the round when an earlier participant claims", () => {
    expect(
      resolveClaimDecision({
        roundStatus: "active",
        inviterParticipantId: "c",
        inviterParentParticipantId: "b",
        claimantParticipantId: "a",
      }),
    ).toEqual({
      type: "round_complete",
      inviteStatus: "claimed",
      connectionKind: "closing_loop",
      requiresNewParticipant: false,
      lockPendingInvites: true,
    });
  });

  it("locks pending invites once the round is already complete", () => {
    expect(
      resolveClaimDecision({
        roundStatus: "completed",
        inviterParticipantId: "c",
        inviterParentParticipantId: "b",
        claimantParticipantId: "a",
      }),
    ).toEqual({
      type: "round_already_complete",
      inviteStatus: "locked",
      requiresNewParticipant: false,
      lockPendingInvites: true,
    });
  });

  it("rejects duplicate display names", () => {
    expect(() =>
      resolveClaimDecision({
        roundStatus: "active",
        inviterParticipantId: "b",
        inviterParentParticipantId: "a",
        claimantParticipantId: null,
        displayName: "Ava Stone",
        isDisplayNameAvailable: false,
      }),
    ).toThrowError(AppError);
  });
});

describe("assertFinalGraphAvailable", () => {
  it("keeps the final graph hidden until completion", () => {
    expect(
      assertFinalGraphAvailable({
        roundStatus: "active",
        completedAt: null,
      }),
    ).toBe(false);

    expect(
      assertFinalGraphAvailable({
        roundStatus: "completed",
        completedAt: "2026-04-21T00:00:00.000Z",
      }),
    ).toBe(true);
  });
});
