import Link from "next/link";
import {
  ClockCounterClockwise,
  Graph,
  LinkSimpleHorizontal,
  PlayCircle,
} from "@phosphor-icons/react/dist/ssr";
import { CreateRoundForm } from "@/components/studio/create-round-form";
import { SiteHeader } from "@/components/layout/site-header";
import { requirePageUser } from "@/lib/auth";
import { listUserRounds } from "@/lib/rounds";
import { roundGraphPath, roundPath, studioPath } from "@/lib/routes";
import { formatTimestamp, normalizeDisplayName } from "@/lib/utils";

export const dynamic = "force-dynamic";

function suggestDisplayName(email: string | undefined) {
  if (!email) {
    return "";
  }

  const [localPart] = email.split("@");
  return normalizeDisplayName(localPart.replace(/[._-]+/g, " "));
}

export default async function StudioPage() {
  const user = await requirePageUser(studioPath());
  const rounds = await listUserRounds(user.id);
  const activeRounds = rounds.filter((round) => round.status === "active");
  const completedRounds = rounds.filter((round) => round.status === "completed");

  return (
    <main className="page-shell">
      <SiteHeader userEmail={user.email} />
      <div className="content-wrap py-8 sm:py-10">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <p className="eyebrow">Your studio</p>
            <h1 className="section-title max-w-3xl font-semibold text-balance text-ink">
              Start a round quickly, then reopen it whenever the chain moves.
            </h1>
            <p className="body-copy text-sm">
              This page is your home base. It keeps the setup simple, shows which
              rounds are still active, and lets you jump back into a finished graph
              once the loop closes.
            </p>
            <div className="grid gap-3 sm:grid-cols-[1.04fr_0.96fr]">
              <div className="paper-panel p-5">
                <p className="text-sm font-semibold text-ink">Active rounds</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                  {activeRounds.length}
                </p>
              </div>
              <div className="paper-panel p-5">
                <p className="text-sm font-semibold text-ink">Finished rounds</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
                  {completedRounds.length}
                </p>
              </div>
            </div>
          </div>

          <CreateRoundForm suggestedName={suggestDisplayName(user.email)} />
        </section>

        <section className="mt-12 space-y-10">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Active now</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                  Rounds still moving
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted">
                These rounds can still accept fresh links and new claims.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {activeRounds.length === 0 ? (
                <div className="paper-panel p-6 text-sm leading-7 text-muted">
                  Nothing is active yet. Create your first round above and send
                  the opening link to one friend.
                </div>
              ) : (
                activeRounds.map((round) => (
                  <article
                    key={round.slug}
                    className="paper-panel grid gap-5 p-6 lg:grid-cols-[1.05fr_0.95fr]"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="status-pill">
                          <span className="status-dot" />
                          Active
                        </span>
                        <span className="text-sm text-muted">Round {round.slug}</span>
                      </div>
                      <h3 className="text-3xl font-semibold tracking-tight text-ink">
                        {round.myDisplayName}
                      </h3>
                      <p className="text-sm leading-7 text-muted">
                        Started {formatTimestamp(round.createdAt)}. Keep the chain
                        moving until someone closes the loop.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-line bg-white/70 p-4">
                        <p className="text-sm font-semibold text-ink">Friends in round</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                          {round.totalParticipants}
                        </p>
                      </div>
                      <div className="rounded-[1.5rem] border border-line bg-white/70 p-4">
                        <p className="text-sm font-semibold text-ink">Links sent</p>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                          {round.invitesSent}
                        </p>
                      </div>
                      <div className="sm:col-span-2 flex flex-wrap gap-3">
                        <Link href={roundPath(round.slug)} className="primary-button">
                          <PlayCircle size={18} weight="bold" />
                          Open round
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Finished</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                  Rounds ready to reopen
                </h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-muted">
                These rounds are locked. Everyone in them can open the finished graph.
              </p>
            </div>
            <div className="mt-6 space-y-4">
              {completedRounds.length === 0 ? (
                <div className="paper-panel p-6 text-sm leading-7 text-muted">
                  No finished rounds yet. When the first loop closes, it will
                  show up here with a shortcut to the final graph.
                </div>
              ) : (
                completedRounds.map((round) => (
                  <article
                    key={round.slug}
                    className="paper-panel grid gap-5 p-6 lg:grid-cols-[1fr_1fr]"
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="status-pill">
                          <span className="status-dot warning-dot" />
                          Finished
                        </span>
                        <span className="text-sm text-muted">Round {round.slug}</span>
                      </div>
                      <h3 className="text-3xl font-semibold tracking-tight text-ink">
                        {round.myDisplayName}
                      </h3>
                      <p className="text-sm leading-7 text-muted">
                        Closed {formatTimestamp(round.completedAt)} after
                        {round.totalParticipants} friends joined the chain.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={roundPath(round.slug)} className="secondary-button">
                        <ClockCounterClockwise size={18} weight="bold" />
                        View round
                      </Link>
                      <Link href={roundGraphPath(round.slug)} className="primary-button">
                        <Graph size={18} weight="bold" />
                        Open finished graph
                      </Link>
                      <div className="text-sm text-muted">
                        <LinkSimpleHorizontal size={16} weight="bold" className="inline-block align-[-2px]" />{" "}
                        {round.invitesSent} links were sent from your place.
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
