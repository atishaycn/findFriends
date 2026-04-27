"use client";

import { ArrowRight, RadioButton } from "@phosphor-icons/react";
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
    <section className="glass-panel p-6 md:p-7">
      <div className="space-y-2">
        <div className="chip-row">
          <RadioButton size={14} weight="fill" className="text-[var(--accent)]" />
          Start a round
        </div>
        <h2 className="section-title mt-4 max-w-[10ch]">
          Start the first node.
        </h2>
        <p className="body-copy text-sm">
          You become the root, launch the first invite, and keep the graph under
          wraps until the right closing edge lands.
        </p>
      </div>
      <form onSubmit={handleCreateRound} className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="field-block">
          <span className="field-label">Your display name</span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="text-input"
            required
            minLength={2}
            maxLength={24}
          />
          <span className="field-help">
            This is the name your friends will see when your node appears.
          </span>
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="primary-button h-fit disabled:cursor-not-allowed disabled:opacity-55"
        >
          <ArrowRight size={16} weight="bold" />
          {isPending ? "Opening round..." : "Create round"}
        </button>
      </form>
      {isPending ? (
        <div className="mt-4 grid gap-2">
          <div className="skeleton h-3 rounded-full" />
          <div className="skeleton h-3 w-2/3 rounded-full" />
        </div>
      ) : null}
      {error ? (
        <p className="notice-error mt-4">
          {error}
        </p>
      ) : null}
    </section>
  );
}
