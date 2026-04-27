"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowSquareOut,
  CheckCircle,
  LinkSimple,
  Warning,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { invitePath, roundGraphPath, roundPath, studioPath } from "@/lib/routes";
import type { ClaimInviteResult, InvitePreview } from "@/lib/types";

type Notice = {
  title: string;
  body: string;
  href: string;
  action: string;
  tone?: "warning" | "success";
};

export function InviteClaimPanel({
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
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isPending, setIsPending] = useState(false);

  if (!isAuthenticated) {
    if (preview.roundStatus === "completed" && !preview.viewerParticipantId) {
      return (
        <section className="paper-panel p-6 sm:p-8">
          <p className="eyebrow">Round finished</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            This link reached you after the round was already complete.
          </h2>
          <p className="body-copy mt-4 text-sm">
            No one new can join this round now. If you want to play, ask a friend
            to start a fresh round and send you a new link.
          </p>
        </section>
      );
    }

    return (
      <div className="space-y-5">
        <section className="paper-panel p-6 sm:p-8">
          <p className="eyebrow">Your invite</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            You are next in line.
          </h2>
          <p className="body-copy mt-4 text-sm">
            What this does: claims your place in the round.
            <br />
            What happens next: after you sign in, you can keep the chain going by
            sending one fresh link to the next friend.
          </p>
        </section>
        <SignInPanel
          nextPath={invitePath(preview.token)}
          title="Sign in before you claim this link"
          subtitle={`This link came from ${preview.inviterDisplayName}. Sign in on this device so the round knows it is really you.`}
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
        throw new Error(payload.error ?? "Could not claim this link.");
      }

      if (payload.type === "joined") {
        router.push(roundPath(payload.roundSlug));
        return;
      }

      if (payload.type === "round_complete") {
        router.push(roundGraphPath(payload.roundSlug));
        return;
      }

      if (payload.type === "round_already_complete") {
        if (preview.viewerParticipantId) {
          router.push(roundGraphPath(payload.roundSlug));
          return;
        }

        setNotice({
          title: "The round finished before you got here",
          body: "This link no longer adds anyone new. You can head back to the home page or ask for a fresh round.",
          href: "/",
          action: "Back home",
        });
        return;
      }

      if (payload.type === "self_claim") {
        setNotice({
          title: "This link came back to you",
          body: "That warning does not finish the round. Open your round and send a fresh link to someone else.",
          href: roundPath(payload.roundSlug),
          action: "Open my round",
          tone: "warning",
        });
        return;
      }

      setNotice({
        title: "This link went straight back",
        body: `${payload.inviterDisplayName} sent the link right back to an earlier person, so it counts as a warning instead of a finish. Open your round and send a fresh link forward.`,
        href: roundPath(payload.roundSlug),
        action: "Open my round",
        tone: "warning",
      });
    } catch (claimError) {
      setError(
        claimError instanceof Error
          ? claimError.message
          : "Could not claim this link.",
      );
    } finally {
      setIsPending(false);
    }
  }

  if (preview.roundStatus === "completed") {
    if (preview.viewerParticipantId) {
      return (
        <section className="paper-panel p-6 sm:p-8">
          <p className="eyebrow">Finished graph</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            You were already part of this round.
          </h2>
          <p className="body-copy mt-4 text-sm">
            The full graph is ready now. Open it to see everyone who ended up in
            the finished loop.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={roundGraphPath(preview.roundSlug)} className="primary-button">
              <ArrowSquareOut size={18} weight="bold" />
              Open finished graph
            </Link>
          </div>
        </section>
      );
    }

    return (
      <section className="paper-panel p-6 sm:p-8">
        <p className="eyebrow">Round finished</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
          This round is closed now.
        </h2>
        <p className="body-copy mt-4 text-sm">
          The finishing loop already happened, so this link cannot add anyone new.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={studioPath()} className="secondary-button">
            Open studio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="glass-panel p-6 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Claim this link</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Make this round yours, then pass it forward.
          </h2>
        </div>
        <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
          <LinkSimple size={20} weight="bold" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">
        What this does: saves your place in the round.
        <br />
        What happens next: if the round stays open, you will get your own screen
        where you can send the next link to one friend.
      </p>
      <div className="mt-5 rounded-[1.5rem] border border-line bg-white/70 p-4 text-sm text-muted">
        Signed in as <span className="font-semibold text-ink">{userEmail}</span>
      </div>
      <form onSubmit={handleClaim} className="mt-6 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Your display name</span>
          <input
            type="text"
            required={!preview.viewerParticipantId}
            minLength={2}
            maxLength={24}
            readOnly={Boolean(preview.viewerParticipantId)}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="input-shell read-only:cursor-default read-only:bg-[rgba(34,27,20,0.04)]"
          />
          <span className="text-sm text-muted">
            Friends inside this round will see this name.
          </span>
        </label>
        <MagneticButton
          type="submit"
          disabled={isPending}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          <CheckCircle size={18} weight="bold" />
          {isPending ? "Claiming your spot..." : "Claim this link"}
        </MagneticButton>
      </form>
      {notice ? (
        <div
          className={`mt-5 rounded-[1.5rem] border px-4 py-4 text-sm ${
            notice.tone === "warning"
              ? "border-[rgba(160,111,38,0.22)] bg-[rgba(160,111,38,0.08)]"
              : "border-[rgba(77,138,92,0.22)] bg-[rgba(77,138,92,0.08)]"
          }`}
        >
          <div className="flex items-start gap-3">
            <Warning size={18} weight="fill" className="mt-0.5 text-[rgba(160,111,38,0.92)]" />
            <div>
              <h3 className="font-semibold text-ink">{notice.title}</h3>
              <p className="mt-1 leading-7 text-muted">{notice.body}</p>
            </div>
          </div>
          <Link href={notice.href} className="secondary-button mt-4">
            {notice.action}
          </Link>
        </div>
      ) : null}
      {error ? (
        <div className="mt-5 rounded-[1.4rem] border border-[rgba(182,77,67,0.26)] bg-[rgba(182,77,67,0.08)] px-4 py-3 text-sm text-ink">
          {error}
        </div>
      ) : null}
    </motion.section>
  );
}
