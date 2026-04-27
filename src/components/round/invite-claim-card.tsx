"use client";

import Link from "next/link";
import { ArrowRight, LinkSimpleHorizontal } from "@phosphor-icons/react";
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
  siteUrl,
  supabaseUrl,
  supabaseAnonKey,
}: {
  preview: InvitePreview;
  isAuthenticated: boolean;
  userEmail: string | null;
  suggestedDisplayName: string;
  siteUrl?: string;
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
        <div className="glass-panel p-6 md:p-7">
          <p className="section-kicker">Round closed</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            This graph already completed.
          </h2>
          <p className="body-copy mt-3 text-sm">
            The valid loop has already been found, so this invite no longer accepts a
            new participant.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="hero-slab overflow-hidden px-6 py-7 md:px-8 md:py-9">
          <p className="section-kicker">Live invite</p>
          <h2 className="section-title mt-3 max-w-[7ch]">
            The chain landed on you.
          </h2>
          <p className="body-copy mt-4 max-w-[54ch] text-sm">
            {preview.inviterDisplayName} passed the chain to you. Claim your spot,
            then tag the next person before the loop closes somewhere else.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[rgba(18,23,20,0.62)]">
            <span className="chip-row">
              Claim this node
            </span>
            <span className="chip-row">
              Tag next person
            </span>
          </div>
        </div>
        <SignInPanel
          nextPath={invitePath(preview.token)}
          title="Sign in to keep it moving"
          subtitle={`This invite came from ${preview.inviterDisplayName}. Open the sign-in link on this device, claim your node, and send the next invite forward.`}
          siteUrl={siteUrl}
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
      <div className="glass-panel p-6 md:p-7">
        <p className="section-kicker">Final graph</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">
          This round is already complete.
        </h2>
        <p className="body-copy mt-3 text-sm">
          You are already part of it. Open the finished graph to see every connection.
        </p>
        <Link href={roundGraphPath(preview.roundSlug)} className="primary-button mt-6 inline-flex">
          Open final graph
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 md:p-7">
      <div className="space-y-2">
        <p className="section-kicker">Claim invite</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
          {preview.inviterDisplayName} sent you a live link.
        </h2>
        <p className="body-copy max-w-[52ch] text-sm">
          Use your display name for this round. If you already belong to the graph,
          claiming this link may either warn you about a direct return or close the
          full loop.
        </p>
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-[var(--line)] bg-white/60 p-4 text-sm text-[var(--muted)]">
        Signed in as <span className="font-semibold text-[var(--ink)]">{userEmail}</span>
      </div>
      <form onSubmit={handleClaim} className="mt-6 space-y-4">
        <label className="field-block">
          <span className="field-label">Display name</span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            readOnly={Boolean(preview.viewerParticipantId)}
            className="text-input read-only:bg-[rgba(18,23,20,0.04)]"
            required={!preview.viewerParticipantId}
            minLength={2}
            maxLength={24}
          />
          <span className="field-help">
            This stays attached to your node for the rest of the round.
          </span>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          <LinkSimpleHorizontal size={16} weight="bold" />
          {isPending ? "Claiming..." : "Claim this node"}
        </button>
        {isPending ? (
          <div className="grid gap-2">
            <div className="skeleton h-3 rounded-full" />
            <div className="skeleton h-3 w-4/5 rounded-full" />
          </div>
        ) : null}
      </form>
      {notice ? (
        <div className="mt-5 rounded-[1.6rem] border border-[rgba(47,108,87,0.14)] bg-[rgba(220,233,226,0.78)] p-5">
          <h3 className="text-lg font-semibold text-[var(--ink)]">{notice.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[rgba(33,81,65,0.84)]">{notice.body}</p>
          <Link href={notice.href} className="primary-button mt-4 inline-flex">
            <ArrowRight size={16} weight="bold" />
            {notice.action}
          </Link>
        </div>
      ) : null}
      {error ? (
        <p className="notice-error mt-4">
          {error}
        </p>
      ) : null}
    </div>
  );
}
