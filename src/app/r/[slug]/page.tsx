import { notFound } from "next/navigation";
import {
  ArrowClockwise,
  LinkSimple,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { SiteHeader } from "@/components/layout/site-header";
import { InviteComposer } from "@/components/round/invite-composer";
import { requirePageUser } from "@/lib/auth";
import { getRoundWorkspace } from "@/lib/rounds";
import { roundPath } from "@/lib/routes";
import { formatTimestamp } from "@/lib/utils";

export default async function RoundPage(props: PageProps<"/r/[slug]">) {
  const { slug } = await props.params;
  const user = await requirePageUser(roundPath(slug));
  const workspace = await getRoundWorkspace(slug, user.id);

  if (!workspace) {
    notFound();
  }

  return (
    <main className="page-shell">
      <SiteHeader userEmail={user.email} />
      <div className="content-wrap py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-5">
            <p className="eyebrow">Round {workspace.slug}</p>
            <h1 className="section-title max-w-3xl font-semibold text-balance text-ink">
              {workspace.participant.displayName}, this is your place in the chain.
            </h1>
            <p className="body-copy text-sm">
              {workspace.participant.parentDisplayName
                ? `${workspace.participant.parentDisplayName} brought you into this round. Keep it moving by sending one fresh link to one next friend.`
                : "You started this round. Send the first link to one friend and let the chain take it from there."}
            </p>
          </div>
          <div className="paper-panel p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-line bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <UsersThree size={20} weight="bold" className="mt-0.5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-ink">People already in</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                      {workspace.totalParticipants}
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-line bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <LinkSimple size={20} weight="bold" className="mt-0.5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Open links</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                      {workspace.pendingInvites}
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-2 rounded-[1.5rem] border border-line bg-white/70 p-4">
                <div className="flex items-start gap-3">
                  <ArrowClockwise size={20} weight="bold" className="mt-0.5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Started</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {formatTimestamp(workspace.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="glass-panel p-6">
            <p className="text-sm font-semibold text-ink">What counts as a finish</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              The round finishes only when the link reaches an earlier person the
              right way. Sending it straight back creates a warning instead.
            </p>
          </div>
          <div className="glass-panel p-6">
            <p className="text-sm font-semibold text-ink">What to do next</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              Make one fresh link, send it to one friend, then check back here to
              see whether it was claimed.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <InviteComposer initialData={workspace} />
        </section>
      </div>
    </main>
  );
}
