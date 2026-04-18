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
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState(suggestedName);
  const [prompt, setPrompt] = useState("");
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
          prompt,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not create a loop.");
      }

      startTransition(() => {
        setIsOpen(false);
        router.push(roundPath(payload.slug));
      });
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create a loop.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="loop-fab">
        Start a New Loop
      </button>
      {isOpen ? (
        <div className="fixed inset-0 z-40 flex items-end bg-slate-950/30 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
          <section className="loop-card w-full max-w-2xl rounded-[2rem] p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] sm:p-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
                Create a Loop
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Name your Loop or set a rule.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                You start the chain, set the prompt, and send the first handoff.
              </p>
            </div>
            <form onSubmit={handleCreateRound} className="mt-6 space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Loop prompt
                </span>
                <input
                  type="text"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="e.g. Pass this to someone who loves indie music"
                  className="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                  minLength={3}
                  maxLength={120}
                  autoFocus
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Your display name
                </span>
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  required
                  minLength={2}
                  maxLength={24}
                />
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="loop-button disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isPending ? "Generating..." : "Generate Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="loop-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
            {error ? (
              <p className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
