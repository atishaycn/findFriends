"use client";

import { startTransition, useState } from "react";
import { authCallbackPath } from "@/lib/routes";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { validateSupabasePublicConfig } from "@/lib/supabase/public-config";

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
  const configValidation = validateSupabasePublicConfig({
    supabaseUrl,
    supabasePublicKey: supabaseAnonKey,
  });
  const isConfigured = configValidation.ok;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured) {
      setError(configValidation.message);
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
          ? submitError.message === "Invalid API key"
            ? "Supabase public config does not match. NEXT_PUBLIC_SUPABASE_URL and the public key must come from the same Supabase project."
            : submitError.message
          : "Could not send the sign-in email.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={`ink-panel orbital-panel ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
          Email sign-in
        </p>
        <h2 className="font-display text-4xl leading-none text-ink">{title}</h2>
        <p className="max-w-md text-sm leading-7 text-white/72">{subtitle}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
            Email
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[1.35rem] border border-white/12 bg-white/8 px-4 py-3 text-base text-ink outline-none transition placeholder:text-white/34 focus:border-[rgba(255,209,102,0.58)] focus:bg-white/12"
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
        <p className="mt-4 rounded-2xl border border-[rgba(255,209,102,0.32)] bg-[rgba(255,209,102,0.14)] px-4 py-3 text-sm text-ink">
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
