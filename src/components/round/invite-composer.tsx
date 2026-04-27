"use client";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import {
  CheckCircle,
  Copy,
  LinkSimple,
  PaperPlaneTilt,
  SpinnerGap,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";
import type { RoundWorkspaceData } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

export function InviteComposer({
  initialData,
}: {
  initialData: RoundWorkspaceData;
}) {
  const [workspace, setWorkspace] = useState(initialData);
  const [latestInvite, setLatestInvite] = useState<{
    shareUrl: string;
    shareMessage: string;
  } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusLabel = useMemo(
    () => (workspace.status === "completed" ? "Finished" : "In progress"),
    [workspace.status],
  );

  async function syncWorkspace() {
    setIsRefreshing(true);

    try {
      const response = await fetch(`/api/rounds/${workspace.slug}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as RoundWorkspaceData;
      setWorkspace(payload);
    } finally {
      setIsRefreshing(false);
    }
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
    setError(null);
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

      const payload = (await response.json()) as {
        invite?: { shareUrl: string };
        shareMessage?: string;
        error?: string;
      };

      if (!response.ok || !payload.invite || !payload.shareMessage) {
        throw new Error(payload.error ?? "Could not create a new link.");
      }

      setLatestInvite({
        shareUrl: payload.invite.shareUrl,
        shareMessage: payload.shareMessage,
      });
      setNotice("Your next link is ready to send.");
      await syncWorkspace();
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : "Could not create a new link.",
      );
    } finally {
      setIsCreatingInvite(false);
    }
  }

  async function copyShareMessage() {
    if (!latestInvite) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestInvite.shareMessage);
      setNotice("Copied the message and link.");
    } catch {
      setError("Could not copy the link on this device. Open the link directly instead.");
    }
  }

  async function shareInvite() {
    if (!latestInvite) {
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join my findFriends round",
          text: latestInvite.shareMessage,
          url: latestInvite.shareUrl,
        });
        setNotice("The link sheet is open. Send it to one friend.");
        return;
      }
    } catch {
      setError("Could not open the share sheet. Copy the message instead.");
      return;
    }

    await copyShareMessage();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Round status</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {statusLabel}
              </h2>
            </div>
            <span className="status-pill">
              <span
                className={`status-dot ${
                  workspace.status === "completed" ? "warning-dot" : ""
                }`}
              />
              {workspace.status}
            </span>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            What this does: shows where your round stands right now.
            <br />
            What happens next: if the round is still open, send the next link and
            wait for someone else to keep it moving.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.4rem] border border-line bg-white/70 p-4">
              <p className="text-sm font-semibold text-ink">Friends already in</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                {workspace.totalParticipants}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-line bg-white/70 p-4">
              <p className="text-sm font-semibold text-ink">Open links waiting</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                {workspace.pendingInvites}
              </p>
            </div>
          </div>
          {workspace.status === "completed" ? (
            <div className="mt-6 rounded-[1.5rem] border border-[rgba(224,107,76,0.24)] bg-[rgba(224,107,76,0.08)] p-4">
              <p className="text-sm font-semibold text-ink">
                The round finished on {formatTimestamp(workspace.completedAt)}.
              </p>
              <p className="mt-2 text-sm leading-7 text-muted">
                Everyone in the round can open the finished graph now.
              </p>
              <a href={workspace.graphUrl} className="secondary-button mt-4">
                <CheckCircle size={18} weight="bold" />
                Open finished graph
              </a>
            </div>
          ) : null}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="paper-panel p-6 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Send the next link</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                One fresh link. One next friend.
              </h2>
            </div>
            <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
              <LinkSimple size={20} weight="bold" />
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            What this does: makes a link that belongs to your place in the round.
            <br />
            What happens next: send it in chat, then the next person can claim it.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <MagneticButton
              type="button"
              onClick={handleCreateInvite}
              disabled={workspace.status !== "active" || isCreatingInvite}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isCreatingInvite ? (
                <SpinnerGap size={18} weight="bold" className="animate-spin" />
              ) : (
                <PaperPlaneTilt size={18} weight="bold" />
              )}
              {isCreatingInvite ? "Making your link..." : "Create next link"}
            </MagneticButton>
            <button
              type="button"
              onClick={() => {
                void syncWorkspace();
              }}
              className="secondary-button"
            >
              {isRefreshing ? (
                <SpinnerGap size={18} weight="bold" className="animate-spin" />
              ) : (
                <LinkSimple size={18} weight="bold" />
              )}
              Refresh
            </button>
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-line bg-white/70 p-4">
            {latestInvite ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={latestInvite.shareUrl}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.28 }}
                >
                  <p className="text-sm font-semibold text-ink">Latest link</p>
                  <p className="mt-3 break-all text-sm leading-7 text-muted">
                    {latestInvite.shareUrl}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button type="button" onClick={copyShareMessage} className="secondary-button">
                      <Copy size={18} weight="bold" />
                      Copy message
                    </button>
                    <button type="button" onClick={shareInvite} className="primary-button">
                      <PaperPlaneTilt size={18} weight="bold" />
                      Send this to one friend
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div>
                <p className="text-sm font-semibold text-ink">No link ready yet</p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  Create one when you are ready to pass the round to the next person.
                </p>
              </div>
            )}
          </div>
          {notice ? (
            <div className="mt-4 rounded-[1.4rem] border border-[rgba(77,138,92,0.24)] bg-[rgba(77,138,92,0.08)] px-4 py-3 text-sm text-ink">
              {notice}
            </div>
          ) : null}
          {error ? (
            <div className="mt-4 rounded-[1.4rem] border border-[rgba(182,77,67,0.26)] bg-[rgba(182,77,67,0.08)] px-4 py-3 text-sm text-ink">
              {error}
            </div>
          ) : null}
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="paper-panel p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Links you sent</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
              Track what left your hands.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-muted">
            You only see the links you created while the round is still open.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {workspace.invites.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-line-strong bg-white/60 p-5 text-sm leading-7 text-muted">
              No links sent yet. When you create one, it will show up here along
              with whether it was claimed, warned, or locked after the round finished.
            </div>
          ) : (
            workspace.invites.map((invite, index) => (
              <div
                key={invite.id}
                className="stagger-rise rounded-[1.5rem] border border-line bg-white/72 p-4"
                style={{ ["--index" as string]: index }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {invite.claimedByDisplayName
                        ? `Claimed by ${invite.claimedByDisplayName}`
                        : invite.status === "blocked_return"
                          ? "Returned to someone who was already in the round"
                          : invite.status === "locked"
                            ? "Locked when the round finished"
                            : "Waiting for someone to claim it"}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-muted">
                      Created {formatTimestamp(invite.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="status-pill">{invite.status.replace("_", " ")}</span>
                    <a
                      href={invite.shareUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="secondary-button px-4 py-2 text-sm"
                    >
                      Open link
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.section>
    </div>
  );
}
