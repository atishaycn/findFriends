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
  siteUrl,
  supabaseUrl,
  supabaseAnonKey,
}: {
  nextPath?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  siteUrl?: string;
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

  function resolveRedirectBaseUrl() {
    if (typeof window === "undefined") {
      return siteUrl;
    }

    const currentOrigin = window.location.origin;

    if (!siteUrl) {
      return currentOrigin;
    }

    try {
      const configuredUrl = new URL(siteUrl);
      const isLocalConfiguredUrl =
        configuredUrl.hostname === "localhost" ||
        configuredUrl.hostname === "127.0.0.1";
      const isLocalCurrentOrigin =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (isLocalConfiguredUrl && !isLocalCurrentOrigin) {
        return currentOrigin;
      }
    } catch {
      return currentOrigin;
    }

    return siteUrl;
  }

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
      const redirectBaseUrl = resolveRedirectBaseUrl();
      const redirectTo = new URL(
        authCallbackPath(nextPath),
        redirectBaseUrl,
      ).toString();
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
        setMessage("Magic link sent. Open it on this device to join Loop.");
        setEmail("");
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message === "Invalid API key"
            ? "Supabase rejected the public browser key. Replace NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY with the current public key for this Supabase project."
            : submitError.message
          : "Could not send the sign-in email.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={`loop-card ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Sign in
        </p>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-md text-sm leading-7 text-slate-600">{subtitle}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Email
          </span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            required
          />
        </label>
        <button
          type="submit"
          disabled={isPending || !isConfigured}
          className="loop-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          {isPending ? "Sending..." : "Send magic link"}
        </button>
      </form>
      {message ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
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
