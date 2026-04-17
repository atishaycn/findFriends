"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { roundPath } from "@/lib/routes";

export function CreateRoundCard({
  suggestedName,
}: {
  suggestedName: string;
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(suggestedName);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleCreateRound(event: React.FormEvent<HTMLFormElement>) {
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

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create a round.");
      }

      startTransition(() => {
        router.push(roundPath(payload.slug));
      });
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create a round.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section className="ink-panel p-6 sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">
          Start a round
        </p>
        <h2 className="font-display text-4xl leading-none text-ink sm:text-5xl">
          Start the first node.
        </h2>
        <p className="max-w-xl text-sm leading-6 text-ink/68">
          You become the root, generate links, and watch the round stay open
          until a valid loop closes it.
        </p>
      </div>
      <form onSubmit={handleCreateRound} className="mt-6 flex flex-col gap-4 md:flex-row">
        <label className="flex-1 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/52">
            Your display name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full rounded-[1.35rem] border border-black/10 bg-white/80 px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:bg-white"
            required
            minLength={2}
            maxLength={24}
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="ink-button h-fit self-end disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Opening round..." : "Create round"}
        </button>
      </form>
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </section>
  );
}
