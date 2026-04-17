"use client";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import type { RoundWorkspaceData } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export function RoundWorkspace({
  initialData,
}: {
  initialData: RoundWorkspaceData;
}) {
  const [workspace, setWorkspace] = useState(initialData);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [latestInvite, setLatestInvite] = useState<{
    shareUrl: string;
    shareMessage: string;
  } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);

  async function syncWorkspace() {
    const response = await fetch(`/api/rounds/${workspace.slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as RoundWorkspaceData;
    startTransition(() => {
      setWorkspace(payload);
    });
  }

  const pollWorkspace = useEffectEvent(() => {
    void syncWorkspace();
  });

  useEffect(() => {
    if (workspace.status !== "active") {
      return;
    }

    const intervalId = window.setInterval(() => {
      pollWorkspace();
    }, 8000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [workspace.status]);

  async function handleCreateInvite() {
    setIsCreatingInvite(true);
    setInviteError(null);
    setNotice(null);

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roundSlug: workspace.slug,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create an invite.");
      }

      setLatestInvite({
        shareUrl: payload.invite.shareUrl,
        shareMessage: payload.shareMessage,
      });
      setNotice("Invite ready. Send it in any chat thread.");
      await syncWorkspace();
    } catch (inviteCreateError) {
      setInviteError(
        inviteCreateError instanceof Error
          ? inviteCreateError.message
          : "Could not create an invite.",
      );
    } finally {
      setIsCreatingInvite(false);
    }
  }

  async function copyShareMessage() {
    if (!latestInvite) {
      return;
    }

    await navigator.clipboard.writeText(latestInvite.shareMessage);
    setNotice("Share text copied.");
  }

  async function shareInvite() {
    if (!latestInvite) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Join my friend graph",
        text: latestInvite.shareMessage,
        url: latestInvite.shareUrl,
      });
      return;
    }

    await copyShareMessage();
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="ink-panel space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Round {workspace.slug}
              </p>
              <h1 className="mt-2 font-display text-5xl leading-none text-ink sm:text-6xl">
                {workspace.participant.displayName}
              </h1>
            </div>
            <span
              className={`status-pill ${
                workspace.status === "completed"
                  ? "border-accent/30 bg-accent/12 text-ink"
                  : ""
              }`}
            >
              {workspace.status === "completed" ? "Complete" : "Active"}
            </span>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink/70">
            {workspace.participant.parentDisplayName
              ? `${workspace.participant.parentDisplayName} pulled you into this round. Direct send-backs do not count, so keep the chain moving forward.`
              : "You started this round. Every invite adds a new friend unless the link comes straight back to the previous sender."}
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                Friends in play
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">
                {workspace.totalParticipants}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                Pending invites
              </p>
              <p className="mt-3 text-3xl font-semibold text-ink">
                {workspace.pendingInvites}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-black/8 bg-white/72 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                Started
              </p>
              <p className="mt-3 text-sm leading-6 text-ink/72">
                {formatTimestamp(workspace.createdAt)}
              </p>
            </div>
          </div>
          {workspace.status === "completed" ? (
            <div className="rounded-[1.6rem] border border-accent/28 bg-accent/10 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Final reveal
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Your connection loop is closed.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink/72">
                The round locked on {formatTimestamp(workspace.completedAt)}. The
                full graph is live now.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={workspace.graphUrl} className="ink-button">
                  Open final graph
                </a>
                <a href={workspace.roundUrl} className="ink-button-secondary">
                  Refresh round
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <aside className="ink-panel p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Share
            </p>
            <h2 className="text-2xl font-semibold text-ink">
              Send the next link.
            </h2>
            <p className="text-sm leading-6 text-ink/68">
              Generate a fresh invite, paste it into WhatsApp or iMessage, and let
              the next friend claim it.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateInvite}
            disabled={workspace.status !== "active" || isCreatingInvite}
            className="ink-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isCreatingInvite ? "Drawing invite..." : "Generate invite"}
          </button>
          {latestInvite ? (
            <div className="mt-5 rounded-[1.6rem] border border-black/8 bg-white/78 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/52">
                Latest link
              </p>
              <p className="mt-3 break-all text-sm leading-6 text-ink/80">
                {latestInvite.shareUrl}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={copyShareMessage} className="ink-button-secondary">
                  Copy text
                </button>
                <button type="button" onClick={shareInvite} className="ink-button">
                  Share now
                </button>
              </div>
            </div>
          ) : null}
          {notice ? (
            <p className="mt-4 rounded-2xl border border-accent/24 bg-accent/10 px-4 py-3 text-sm text-ink">
              {notice}
            </p>
          ) : null}
          {inviteError ? (
            <p className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
              {inviteError}
            </p>
          ) : null}
        </aside>
      </section>

      <section className="ink-panel p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Your outgoing links
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              Track what left your node.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-ink/66">
            You can only see your own outbound links until the round closes.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {workspace.invites.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-black/14 bg-white/48 p-5 text-sm text-ink/62">
              No links sent yet. Generate the first one when you are ready.
            </div>
          ) : (
            workspace.invites.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col gap-3 rounded-[1.6rem] border border-black/8 bg-white/78 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-ink">
                    {invite.claimedByDisplayName
                      ? `Claimed by ${invite.claimedByDisplayName}`
                      : invite.status === "blocked_return"
                        ? "Returned to an earlier node"
                        : invite.status === "locked"
                          ? "Locked when the round completed"
                          : "Waiting to be claimed"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/46">
                    Created {formatTimestamp(invite.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="status-pill">{invite.status.replace("_", " ")}</span>
                  <a
                    href={invite.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-black/10 px-4 py-2 text-sm transition hover:border-black/25 hover:bg-white"
                  >
                    Open link
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
