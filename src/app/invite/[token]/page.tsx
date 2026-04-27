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
    <main className="app-shell">
      <SiteHeader userEmail={user?.email} />
      <div className="page-frame grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
        <section className="space-y-6">
          <div className="glass-panel p-6 md:p-7">
            <p className="section-kicker">Invite preview</p>
            <h1 className="section-title mt-3 max-w-[8ch]">
              The chain landed on you.
            </h1>
            <p className="body-copy mt-4 text-sm">
              {preview.inviterDisplayName} sent you a live path into round{" "}
              <span className="font-semibold text-[var(--ink)]">{preview.roundSlug}</span>.
              If you came in through this invite, claim it, become the next node,
              and tag the next person to keep the chain alive.
            </p>
          </div>
          <div className="glass-panel p-6 md:p-7">
            <p className="section-kicker">What happens next</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="soft-panel p-4 text-sm leading-7 text-[var(--muted)]">
                Claiming adds your node to the active graph.
              </div>
              <div className="soft-panel p-4 text-sm leading-7 text-[var(--muted)]">
                Passing it straight back does not count as a closure.
              </div>
            </div>
            <StaticNetwork className="mt-6 w-full max-w-xl" />
          </div>
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
