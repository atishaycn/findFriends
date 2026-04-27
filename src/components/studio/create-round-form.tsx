"use client";

import { useState } from "react";
import { CompassTool, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { roundPath } from "@/lib/routes";

export function CreateRoundForm({
  suggestedName,
}: {
  suggestedName: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(suggestedName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/rounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
        }),
      });

      const payload = (await response.json()) as {
        slug?: string;
        error?: string;
      };

      if (!response.ok || !payload.slug) {
        throw new Error(payload.error ?? "Could not create the round.");
      }

      router.push(roundPath(payload.slug));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create the round.",
      );
    } finally {
      setIsPending(false);
    }
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
          <p className="eyebrow">Start a round</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
            Give yourself a name and open the first link.
          </h2>
        </div>
        <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
          <CompassTool size={20} weight="bold" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">
        What this does: opens a new round with you as the first person in it.
        <br />
        What happens next: you get a shareable link to send to the next friend.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Your display name</span>
          <input
            type="text"
            required
            minLength={2}
            maxLength={24}
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="input-shell"
            placeholder="How your friends know you"
          />
          <span className="text-sm text-muted">
            This is the name other people will see inside this round.
          </span>
        </label>
        <MagneticButton
          type="submit"
          disabled={isPending}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Sparkle size={18} weight="bold" />
          {isPending ? "Creating your round..." : "Create my round"}
        </MagneticButton>
      </form>
      {error ? (
        <div className="mt-5 rounded-[1.4rem] border border-[rgba(182,77,67,0.26)] bg-[rgba(182,77,67,0.08)] px-4 py-3 text-sm text-ink">
          {error}
        </div>
      ) : null}
    </motion.section>
  );
}
