"use client";

import { startTransition, useState } from "react";
import { authCallbackPath } from "@/lib/routes";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignInPanel({
  nextPath,
  title = "Sign in with email",
  subtitle = "Use email sign-in so every friend maps to one identity inside a round.",
  compact = false,
  supabaseUrl,
  supabaseAnonKey,
}: {
  nextPath?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setError(
        "Set the Supabase public environment variables before using email sign-in.",
      );
      return;
    }

    setError(null);
    setMessage(null);
    setIsPending(true);

    try {
      const supabase = createBrowserSupabaseClient({
        supabaseUrl,
        supabaseAnonKey,
      });
      const redirectTo = `${window.location.origin}${authCallbackPath(
        nextPath,
      )}`;
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (authError) {
        throw authError;
      }

      startTransition(() => {
        setMessage(
          "Check your email for your findFriends sign-in link, then open it on this device to continue.",
        );
        setEmail("");
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not send the sign-in email.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={`ink-panel ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        <p className="max-w-md text-sm leading-6 text-ink/68">{subtitle}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/52">
            Email
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[1.35rem] border border-black/10 bg-white/80 px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:bg-white"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isPending || !isConfigured}
          className="ink-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
      {message ? (
        <p className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-ink">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl border border-red-300/60 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
