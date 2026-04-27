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
    <section className="ink-panel orbital-panel p-6 sm:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/56">
          Start a round
        </p>
        <h2 className="font-display text-4xl leading-none text-ink sm:text-5xl">
          Start the first node.
        </h2>
        <p className="max-w-xl text-sm leading-7 text-white/72">
          You become the root, launch the first invite, and watch the graph stay
          in suspense until the real loop lands.
        </p>
      </div>
      <form onSubmit={handleCreateRound} className="mt-6 flex flex-col gap-4 md:flex-row">
        <label className="flex-1 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
            Your display name
          </span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="w-full rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-3 text-base text-ink outline-none transition focus:border-[rgba(255,209,102,0.58)] focus:bg-white/12"
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
