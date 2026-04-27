import { notFound } from "next/navigation";
import {
  ArrowBendRightDown,
  LinkSimple,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { InviteClaimPanel } from "@/components/round/invite-claim-panel";
import { SiteHeader } from "@/components/layout/site-header";
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
    <main className="page-shell">
      <SiteHeader userEmail={user?.email} />
      <div className="content-wrap py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr] lg:items-start">
          <div className="space-y-6">
            <section className="paper-panel p-6 sm:p-8">
              <p className="eyebrow">Invite received</p>
              <h1 className="section-title mt-3 max-w-2xl font-semibold text-balance text-ink">
                {preview.inviterDisplayName} sent a live round your way.
              </h1>
              <p className="body-copy mt-4 text-sm">
                You are opening a link from round {preview.roundSlug}. If the round
                is still active, you can claim your place and become the next
                person who gets to send it forward.
              </p>
            </section>

            <section className="grid gap-4 md:grid-cols-[1.04fr_0.96fr]">
              <article className="paper-panel p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
                    <LinkSimple size={18} weight="bold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">What to do now</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Claim this link with your name, then send the next fresh link
                      to one friend.
                    </p>
                  </div>
                </div>
              </article>
              <article className="paper-panel p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
                    <ArrowBendRightDown size={18} weight="bold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">What does not count</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Sending the link straight back to the same path creates a warning, not a finish.
                    </p>
                  </div>
                </div>
              </article>
            </section>

            <section className="glass-panel p-6 sm:p-8">
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-line bg-white/80 p-3 text-accent">
                  <Warning size={18} weight="fill" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">One gentle rule</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    The round only finishes when the link reaches an earlier person
                    the right way. Direct send-backs are treated as warnings so the
                    game stays fair.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <InviteClaimPanel
            preview={preview}
            isAuthenticated={Boolean(user)}
            userEmail={user?.email ?? null}
            suggestedDisplayName={suggestDisplayName(user?.email)}
            siteUrl={publicEnv.siteUrl}
            supabaseUrl={publicEnv.supabaseUrl}
            supabaseAnonKey={publicEnv.supabaseAnonKey}
          />
        </section>
      </div>
    </main>
  );
}
