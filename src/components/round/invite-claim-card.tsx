"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { invitePath, roundGraphPath, roundPath } from "@/lib/routes";
import type { InvitePreview, ClaimInviteResult } from "@/lib/types";

export function InviteClaimCard({
  preview,
  isAuthenticated,
  userEmail,
  suggestedDisplayName,
  supabaseUrl,
  supabaseAnonKey,
}: {
  preview: InvitePreview;
  isAuthenticated: boolean;
  userEmail: string | null;
  suggestedDisplayName: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(
    preview.viewerDisplayName ?? suggestedDisplayName,
  );
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    title: string;
    body: string;
    href: string;
    action: string;
  } | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!isAuthenticated) {
    if (preview.roundStatus === "completed" && !preview.viewerParticipantId) {
      return (
        <div className="ink-panel orbital-panel p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
            Round closed
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-ink">
            This graph already completed.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-white/72">
            The valid loop has already been found, so this invite no longer accepts a
            new participant.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="invite-crown overflow-hidden rounded-[2rem] px-6 py-7 sm:px-8 sm:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/72">
            Live invite
          </p>
          <h2 className="mt-3 font-display text-6xl leading-[0.86] text-white sm:text-7xl">
            You&apos;re it
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/82">
            {preview.inviterDisplayName} passed the chain to you. Claim your spot,
            then tag the next person before the loop closes somewhere else.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/72">
            <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              Claim this node
            </span>
            <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2">
              Tag next person
            </span>
          </div>
        </div>
        <SignInPanel
          nextPath={invitePath(preview.token)}
          title="Sign in to keep it moving"
          subtitle={`This invite came from ${preview.inviterDisplayName}. Open the sign-in link on this device, claim your node, and send the next invite forward.`}
          supabaseUrl={supabaseUrl}
          supabaseAnonKey={supabaseAnonKey}
        />
      </div>
    );
  }

  async function handleClaim(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsPending(true);

    try {
      const response = await fetch(`/api/invites/${preview.token}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
        }),
      });

      const payload = (await response.json()) as ClaimInviteResult & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not claim the invite.");
      }

      if (payload.type === "joined") {
        startTransition(() => {
          router.push(roundPath(payload.roundSlug));
        });
        return;
      }

      if (payload.type === "round_complete") {
        startTransition(() => {
          router.push(roundGraphPath(payload.roundSlug));
        });
        return;
      }

      if (payload.type === "round_already_complete") {
        if (preview.viewerParticipantId) {
          startTransition(() => {
            router.push(roundGraphPath(payload.roundSlug));
          });
          return;
        }

        setNotice({
          title: "That round already closed",
          body: "The graph finished before this invite was claimed.",
          href: "/",
          action: "Back home",
        });
        return;
      }

      if (payload.type === "self_claim") {
        setNotice({
          title: "You already own this link",
          body: "That invite belongs to your current node. Send it to another friend instead.",
          href: roundPath(payload.roundSlug),
          action: "Open my round",
        });
        return;
      }

      setNotice({
        title: "That link came straight back",
        body: `${payload.inviterDisplayName} sent the link back to an earlier node, so it does not count as a closing loop. Send a fresh link to someone else.`,
        href: roundPath(payload.roundSlug),
        action: "Back to my round",
      });
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Could not claim the invite.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (preview.roundStatus === "completed" && preview.viewerParticipantId) {
    return (
      <div className="ink-panel orbital-panel p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
          Final graph
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">
          This round is already complete.
        </h2>
        <p className="mt-3 text-sm leading-7 text-white/72">
          You are already part of it. Open the finished graph to see every connection.
        </p>
        <Link href={roundGraphPath(preview.roundSlug)} className="ink-button mt-6 inline-flex">
          Open final graph
        </Link>
      </div>
    );
  }

  return (
    <div className="ink-panel orbital-panel p-6 sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
          Claim invite
        </p>
        <h2 className="text-3xl font-semibold text-ink">
          {preview.inviterDisplayName} sent you a live link.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-white/72">
          Use your display name for this round. If you already belong to the graph,
          claiming this link may either warn you about a direct return or close the
          full loop.
        </p>
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/7 p-4 text-sm text-white/72">
        Signed in as <span className="font-semibold text-ink">{userEmail}</span>
      </div>
      <form onSubmit={handleClaim} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
            Display name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            readOnly={Boolean(preview.viewerParticipantId)}
            className="w-full rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-3 text-base text-ink outline-none transition focus:border-[rgba(255,209,102,0.58)] focus:bg-white/12 read-only:bg-white/5"
            required={!preview.viewerParticipantId}
            minLength={2}
            maxLength={24}
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="ink-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Claiming..." : "Claim this node"}
        </button>
      </form>
      {notice ? (
        <div className="mt-5 rounded-[1.6rem] border border-[rgba(255,141,93,0.3)] bg-[rgba(255,141,93,0.12)] p-5">
          <h3 className="text-lg font-semibold text-ink">{notice.title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/76">{notice.body}</p>
          <Link href={notice.href} className="ink-button mt-4 inline-flex">
            {notice.action}
          </Link>
        </div>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
