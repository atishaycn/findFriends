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
  const [acceptedInvite, setAcceptedInvite] = useState<{
    roundSlug: string;
    shareUrl: string;
    shareMessage: string;
  } | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!isAuthenticated) {
    if (preview.roundStatus === "completed" && !preview.viewerParticipantId) {
      return (
        <div className="loop-card w-full p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Loop closed
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-950">
            This Loop already closed.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            The chain already found its way back. This invite can’t add anyone new.
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto grid w-full max-w-4xl gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="invite-hero overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-100">
            Live invite
          </p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] text-white sm:text-6xl">
            {preview.inviterDisplayName} passed you a Loop.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-8 text-indigo-50/92">
            Join to see how far it goes. You won’t see the chain yet, only the chance to keep it moving.
          </p>
          {preview.prompt ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/20 bg-white/10 p-4 text-sm leading-7 text-white">
              “{preview.prompt}”
            </div>
          ) : null}
        </div>
        <SignInPanel
          nextPath={invitePath(preview.token)}
          title="Accept to reveal your link"
          subtitle={`This Loop came from ${preview.inviterDisplayName}. Sign in on this device to accept it.`}
          siteUrl={siteUrl}
          supabaseUrl={supabaseUrl}
          supabaseAnonKey={supabaseAnonKey}
        />
      </div>
    );
  }

  async function copyLink(value: string) {
    await navigator.clipboard.writeText(value);
    setNotice({
      title: "Link copied",
      body: "Send it to one person and keep the Loop moving.",
      href: roundPath(acceptedInvite?.roundSlug ?? preview.roundSlug),
      action: "Open Loop",
    });
  }

  async function shareAcceptedInvite() {
    if (!acceptedInvite) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Join my Loop",
        text: acceptedInvite.shareMessage,
        url: acceptedInvite.shareUrl,
      });
      return;
    }

    await copyLink(acceptedInvite.shareUrl);
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
        const inviteResponse = await fetch("/api/invites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roundSlug: payload.roundSlug,
          }),
        });

        const invitePayload = await inviteResponse.json();

        if (!inviteResponse.ok) {
          throw new Error(invitePayload.error ?? "Could not generate the next invite.");
        }

        setAcceptedInvite({
          roundSlug: payload.roundSlug,
          shareUrl: invitePayload.invite.shareUrl,
          shareMessage: invitePayload.shareMessage,
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
          title: "That Loop already closed",
          body: "The map unlocked before this invite was claimed.",
          href: "/",
          action: "Back home",
        });
        return;
      }

      if (payload.type === "self_claim") {
        setNotice({
          title: "You already own this link",
          body: "That invite belongs to your current node. Send it to someone else instead.",
          href: roundPath(payload.roundSlug),
          action: "Open my Loop",
        });
        return;
      }

      setNotice({
        title: "That link came straight back",
        body: `${payload.inviterDisplayName} sent the link back to an earlier node, so it does not count as a closing loop. Send a fresh link to someone else.`,
        href: roundPath(payload.roundSlug),
        action: "Back to my Loop",
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
      <div className="loop-card w-full p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Final map
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-950">
          This Loop is already revealed.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          You’re already inside it. Open the map to see every connection.
        </p>
        <Link href={roundGraphPath(preview.roundSlug)} className="loop-button mt-6 inline-flex">
          View Map
        </Link>
      </div>
    );
  }

  if (acceptedInvite) {
    return (
      <div className="loop-card mx-auto w-full max-w-2xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          You&apos;re in
        </p>
        <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-slate-950">
          Now, keep it moving.
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Pass your unique forwarding link to one person. The rest stays hidden until the Loop closes.
        </p>
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
          <p className="break-all text-sm leading-7 text-slate-700">
            {acceptedInvite.shareUrl}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void copyLink(acceptedInvite.shareUrl)}
            className="loop-button"
          >
            Copy Link
          </button>
          <button
            type="button"
            onClick={() => void shareAcceptedInvite()}
            className="loop-button-secondary"
          >
            Share via...
          </button>
          <button
            type="button"
            onClick={() => startTransition(() => router.push(roundPath(acceptedInvite.roundSlug)))}
            className="loop-button-secondary"
          >
            Open Loop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="loop-card mx-auto w-full max-w-2xl p-6 sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Accept this Loop
        </p>
        <h2 className="text-3xl font-semibold text-slate-950">
          {preview.inviterDisplayName} invited you in.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          Accept this handoff, then you’ll get a unique link to pass forward.
        </p>
        {preview.prompt ? (
          <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50 p-4 text-sm leading-7 text-indigo-950">
            Prompt: “{preview.prompt}”
          </div>
        ) : null}
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        Signed in as <span className="font-semibold text-slate-950">{userEmail}</span>
      </div>
      <form onSubmit={handleClaim} className="mt-6 space-y-4">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Display name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            readOnly={Boolean(preview.viewerParticipantId)}
            className="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 read-only:bg-slate-50"
            required={!preview.viewerParticipantId}
            minLength={2}
            maxLength={24}
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="loop-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Accepting..." : "Accept & Reveal Link"}
        </button>
      </form>
      {notice ? (
        <div className="mt-5 rounded-[1.6rem] border border-indigo-200 bg-indigo-50 p-5">
          <h3 className="text-lg font-semibold text-slate-950">{notice.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{notice.body}</p>
          <Link href={notice.href} className="loop-button mt-4 inline-flex">
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
