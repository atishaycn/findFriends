"use client";
import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
} from "react";
import {
  ArrowSquareOut,
  ArrowsOutSimple,
  Copy,
  LinkSimpleHorizontal,
  ShareNetwork,
} from "@phosphor-icons/react";
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
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="glass-panel space-y-5 p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="section-kicker">Round {workspace.slug}</p>
              <h1 className="section-title mt-2 max-w-[10ch]">
                {workspace.participant.displayName}
              </h1>
            </div>
            <span className="status-pill">
              <span className="status-dot" />
              {workspace.status === "completed" ? "Complete" : "Active"}
            </span>
          </div>
          <p className="body-copy text-sm">
            {workspace.participant.parentDisplayName
              ? `${workspace.participant.parentDisplayName} pulled you into this round. Direct send-backs do not count, so keep the chain moving forward.`
              : "You started this round. Every invite adds a new friend unless the link comes straight back to the previous sender."}
          </p>
          <div className="grid gap-3 md:grid-cols-[0.9fr_0.9fr_1.2fr]">
            <div className="soft-panel p-4">
              <p className="section-kicker">
                Friends in play
              </p>
              <p className="metric-value mt-3">
                {workspace.totalParticipants}
              </p>
            </div>
            <div className="soft-panel p-4">
              <p className="section-kicker">
                Pending invites
              </p>
              <p className="metric-value mt-3">
                {workspace.pendingInvites}
              </p>
            </div>
            <div className="soft-panel p-4">
              <p className="section-kicker">
                Started
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {formatTimestamp(workspace.createdAt)}
              </p>
            </div>
          </div>
          {workspace.status === "completed" ? (
            <div className="rounded-[1.6rem] border border-[rgba(47,108,87,0.12)] bg-[rgba(220,233,226,0.78)] p-5">
              <p className="section-kicker accent-copy">
                Final reveal
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Your connection loop is closed.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[rgba(33,81,65,0.86)]">
                The round locked on {formatTimestamp(workspace.completedAt)}. The
                full graph is live now.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={workspace.graphUrl} className="primary-button">
                  <ArrowsOutSimple size={16} weight="bold" />
                  Open final graph
                </a>
                <a href={workspace.roundUrl} className="secondary-button">
                  Refresh round
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <aside className="glass-panel p-6 md:p-7">
          <div className="space-y-2">
            <p className="section-kicker">Share</p>
            <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Send the next link.
            </h2>
            <p className="body-copy text-sm">
              Generate a fresh invite, paste it into WhatsApp or iMessage, and let
              the next friend claim it.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateInvite}
            disabled={workspace.status !== "active" || isCreatingInvite}
            className="primary-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-55"
          >
            <LinkSimpleHorizontal size={16} weight="bold" />
            {isCreatingInvite ? "Drawing invite..." : "Generate invite"}
          </button>
          {isCreatingInvite ? (
            <div className="mt-5 rounded-[1.4rem] border border-[var(--line)] bg-white/48 p-4">
              <div className="skeleton h-3 rounded-full" />
              <div className="skeleton mt-3 h-3 w-5/6 rounded-full" />
              <div className="skeleton mt-6 h-10 rounded-full" />
            </div>
          ) : null}
          {latestInvite ? (
            <div className="mt-5 rounded-[1.6rem] border border-[var(--line)] bg-white/60 p-4">
              <p className="section-kicker">
                Latest link
              </p>
              <p className="mt-3 break-all text-sm leading-7 text-[var(--muted)]">
                {latestInvite.shareUrl}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={copyShareMessage} className="secondary-button">
                  <Copy size={16} weight="bold" />
                  Copy text
                </button>
                <button type="button" onClick={shareInvite} className="primary-button">
                  <ShareNetwork size={16} weight="bold" />
                  Share now
                </button>
              </div>
            </div>
          ) : isCreatingInvite ? null : (
            <div className="notice-info mt-5">
              No fresh link yet. Generate one when you are ready to hand the round
              to the next person.
            </div>
          )}
          {notice ? (
            <p className="notice-success mt-4">
              {notice}
            </p>
          ) : null}
          {inviteError ? (
            <p className="notice-error mt-4">
              {inviteError}
            </p>
          ) : null}
        </aside>
      </section>

      <section className="glass-panel p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="section-kicker">Your outgoing links</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
              Track what left your node.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            You can only see your own outbound links until the round closes.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {workspace.invites.length === 0 ? (
            <div className="notice-info">
              No links sent yet. Generate the first one when you are ready.
            </div>
          ) : (
            workspace.invites.map((invite) => (
              <div
                key={invite.id}
                className="grid gap-3 rounded-[1.5rem] border border-[var(--line)] bg-white/52 p-4 md:grid-cols-[1.1fr_0.9fr] md:items-center"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--ink)]">
                    {invite.claimedByDisplayName
                      ? `Claimed by ${invite.claimedByDisplayName}`
                      : invite.status === "blocked_return"
                        ? "Returned to an earlier node"
                        : invite.status === "locked"
                          ? "Locked when the round completed"
                          : "Waiting to be claimed"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[rgba(18,23,20,0.42)]">
                    Created {formatTimestamp(invite.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <span className="status-pill">{invite.status.replace("_", " ")}</span>
                  <a
                    href={invite.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-button px-4 py-2 text-sm"
                  >
                    <ArrowSquareOut size={16} weight="bold" />
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
