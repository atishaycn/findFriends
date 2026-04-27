"use client";

import { useState } from "react";
import { EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { authCallbackPath } from "@/lib/routes";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { validateSupabasePublicConfig } from "@/lib/supabase/public-config";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function SignInPanel({
  nextPath,
  title = "Sign in with email",
  subtitle = "This sends a one-time sign-in link so each friend only takes one spot in a round.",
  siteUrl,
  supabaseUrl,
  supabaseAnonKey,
}: {
  nextPath?: string;
  title?: string;
  subtitle?: string;
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
      const configuredLocal =
        configuredUrl.hostname === "localhost" || configuredUrl.hostname === "127.0.0.1";
      const currentLocal =
        window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

      if (configuredLocal && !currentLocal) {
        return currentOrigin;
      }
    } catch {
      return currentOrigin;
    }

    return siteUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configValidation.ok) {
      setError(configValidation.message);
      return;
    }

    setIsPending(true);
    setMessage(null);
    setError(null);

    try {
      const supabase = createBrowserSupabaseClient({
        supabaseUrl,
        supabaseAnonKey,
      });
      const redirectTo = new URL(
        authCallbackPath(nextPath),
        resolveRedirectBaseUrl(),
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

      setMessage(
        "Check your email on this device. Open the sign-in link, then we will bring you straight back here.",
      );
      setEmail("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message === "Invalid API key"
            ? "The public Supabase key does not match this project yet. Update the public key in your environment and try again."
            : submitError.message
          : "Could not send the sign-in email.",
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
          <p className="eyebrow">Email sign-in</p>
          <h2 className="mt-3 max-w-md text-[2rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {title}
          </h2>
        </div>
        <div className="rounded-full border border-line bg-white/76 p-3 text-accent shadow-[0_18px_30px_-26px_rgba(79,59,33,0.45)]">
          <EnvelopeSimple size={20} weight="bold" />
        </div>
      </div>
      <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{subtitle}</p>
      <p className="poster-note mt-4">
        What this does: verifies who you are with a one-time link.
        <br />
        What happens next: after you open the email, we send you back to the
        exact screen you were trying to use.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">Email address</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="input-shell"
          />
          <span className="text-sm text-muted">
            Use the email address you want tied to your spot in the round.
          </span>
        </label>
        <MagneticButton
          type="submit"
          disabled={isPending || !configValidation.ok}
          className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-55"
        >
          <PaperPlaneTilt size={18} weight="bold" />
          {isPending ? "Sending your sign-in link..." : "Email me the sign-in link"}
        </MagneticButton>
      </form>
      {message ? (
        <div className="mt-5 rounded-[1.4rem] border border-[rgba(77,138,92,0.24)] bg-[rgba(77,138,92,0.08)] px-4 py-3 text-sm text-ink">
          {message}
        </div>
      ) : null}
      {!configValidation.ok ? (
        <div className="mt-5 rounded-[1.4rem] border border-[rgba(160,111,38,0.24)] bg-[rgba(160,111,38,0.08)] px-4 py-3 text-sm text-ink">
          {configValidation.message}
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
