"use client";

import { ArrowRight } from "@phosphor-icons/react";
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
        setMessage(
          "Check your email for your findFriends sign-in link, then open it on this device to continue.",
        );
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
    <div className={`glass-panel ${compact ? "p-5" : "p-6 md:p-7"}`}>
      <div className="space-y-2">
        <p className="section-kicker">Email sign-in</p>
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
          {title}
        </h2>
        <p className="body-copy max-w-[52ch] text-sm">{subtitle}</p>
      </div>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="field-block">
          <span className="field-label">Email</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="text-input"
            required
          />
          <span className="field-help">
            One email equals one identity inside a round.
          </span>
        </label>
        <button
          type="submit"
          disabled={isPending || !isConfigured}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          <ArrowRight size={16} weight="bold" />
          {isPending ? "Signing in..." : "Sign in"}
        </button>
        {isPending ? (
          <div className="grid gap-2">
            <div className="skeleton h-3 rounded-full" />
            <div className="skeleton h-3 w-4/5 rounded-full" />
          </div>
        ) : null}
      </form>
      {message ? (
        <p className="notice-success mt-4">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="notice-error mt-4">
          {error}
        </p>
      ) : null}
    </div>
  );
}
