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
        throw new Error(payload.error ?? "Could not create a link.");
      }

      setLatestInvite({
        shareUrl: payload.invite.shareUrl,
        shareMessage: payload.shareMessage,
      });
      setNotice("Link ready. Send it to one person.");
      await syncWorkspace();
    } catch (inviteCreateError) {
      setInviteError(
        inviteCreateError instanceof Error
          ? inviteCreateError.message
          : "Could not create a link.",
      );
    } finally {
      setIsCreatingInvite(false);
    }
  }

  async function copyShareMessage() {
    if (!latestInvite) {
      return;
    }

    await navigator.clipboard.writeText(latestInvite.shareUrl);
    setNotice("Link copied.");
  }

  async function shareInvite() {
    if (!latestInvite) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Join my Loop",
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
        <div className="loop-card space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Loop {workspace.slug}
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                {workspace.prompt ?? "Untitled Loop"}
              </h1>
              <p className="mt-3 text-base text-slate-600">
                {workspace.participant.parentDisplayName
                  ? `${workspace.participant.parentDisplayName} invited you in.`
                  : "You started this Loop."}
              </p>
            </div>
            <span
              className={`loop-status ${
                workspace.status === "completed"
                  ? "loop-status-complete"
                  : "loop-status-active"
              }`}
            >
              {workspace.status === "completed" ? "Closed" : "Active"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                People in chain
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {workspace.totalParticipants}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Pending invites
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {workspace.pendingInvites}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Started
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {formatTimestamp(workspace.createdAt)}
              </p>
            </div>
          </div>
          {workspace.status === "completed" ? (
            <div className="rounded-[1.6rem] border border-indigo-200 bg-indigo-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700">
                Final reveal
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                Your Loop is closed.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                It locked on {formatTimestamp(workspace.completedAt)}. The map is live now.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href={workspace.graphUrl} className="loop-button">
                  View Map
                </a>
                <a href={workspace.roundUrl} className="loop-button-secondary">
                  Refresh Loop
                </a>
              </div>
            </div>
          ) : null}
        </div>
        <aside className="loop-card p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Share
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              Pass it on
            </h2>
            <p className="text-sm leading-7 text-slate-600">
              Generate your unique forwarding link, copy it, or open the native share sheet.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreateInvite}
            disabled={workspace.status !== "active" || isCreatingInvite}
            className="loop-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-55"
          >
            {isCreatingInvite ? "Generating..." : "Generate Link"}
          </button>
          {latestInvite ? (
            <div className="mt-5 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Your forwarding URL
              </p>
              <p className="mt-3 break-all text-sm leading-6 text-slate-700">
                {latestInvite.shareUrl}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={copyShareMessage} className="loop-button">
                  Copy Link
                </button>
                <button type="button" onClick={shareInvite} className="loop-button-secondary">
                  Share via...
                </button>
              </div>
            </div>
          ) : null}
          {notice ? (
            <p className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-slate-900">
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

      <section className="loop-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Your outgoing links
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Track what left your node.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">
            You only see your own handoffs until the reveal.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {workspace.invites.length === 0 ? (
            <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
              No links sent yet. Generate the first one when you’re ready.
            </div>
          ) : (
            workspace.invites.map((invite) => (
              <div
                key={invite.id}
                className="flex flex-col gap-3 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-950">
                    {invite.claimedByDisplayName
                      ? `Claimed by ${invite.claimedByDisplayName}`
                      : invite.status === "blocked_return"
                        ? "Returned to an earlier node"
                        : invite.status === "locked"
                          ? "Locked when the loop completed"
                          : "Waiting to be claimed"}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Created {formatTimestamp(invite.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="loop-status">{invite.status.replace("_", " ")}</span>
                  <a
                    href={invite.shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm transition hover:border-slate-300 hover:bg-white"
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
