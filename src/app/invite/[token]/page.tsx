import { notFound } from "next/navigation";
import { InviteClaimCard } from "@/components/round/invite-claim-card";
import { SiteHeader } from "@/components/layout/site-header";
import { StaticNetwork } from "@/components/layout/static-network";
import { getCurrentUser } from "@/lib/auth";
import { getPublicEnv } from "@/lib/env";
import { getInvitePreview } from "@/lib/rounds";

function suggestDisplayName(email: string | undefined) {
  if (!email) {
    return "";
  }

  return email.split("@")[0].replace(/[._-]+/g, " ");
}

export default async function InvitePage(props: PageProps<"/invite/[token]">) {
  const { token } = await props.params;
  const user = await getCurrentUser();
  const preview = await getInvitePreview(token, user?.id);
  const publicEnv = getPublicEnv();

  if (!preview) {
    notFound();
  }

  return (
    <main className="paper-grid min-h-screen">
      <SiteHeader userEmail={user?.email} />
      <div className="relative mx-auto grid w-full max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.96fr_1.04fr] lg:items-start">
        <section className="space-y-6">
          <div className="ink-panel p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Invite preview
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-ink sm:text-6xl">
              The chain landed on you.
            </h1>
            <p className="mt-4 text-base leading-8 text-ink/70">
              {preview.inviterDisplayName} sent you a live path into round{" "}
              <span className="font-semibold text-ink">{preview.roundSlug}</span>.
              If you came in through this invite, claim it, become the next node,
              and tag the next person to keep the chain alive.
            </p>
          </div>
          <StaticNetwork className="w-full max-w-xl" />
        </section>

        <InviteClaimCard
          preview={preview}
          isAuthenticated={Boolean(user)}
          userEmail={user?.email ?? null}
          suggestedDisplayName={suggestDisplayName(user?.email)}
          siteUrl={publicEnv.siteUrl}
          supabaseUrl={publicEnv.supabaseUrl}
          supabaseAnonKey={publicEnv.supabaseAnonKey}
        />
      </div>
    </main>
  );
}
