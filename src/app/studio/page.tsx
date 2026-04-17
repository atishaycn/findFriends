import Link from "next/link";
import { CreateRoundCard } from "@/components/studio/create-round-card";
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

  return (
    <main className="paper-grid min-h-screen">
      <SiteHeader userEmail={user.email} />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
        <CreateRoundCard suggestedName={suggestDisplayName(user.email)} />

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                Your rounds
              </p>
              <h1 className="mt-2 font-display text-5xl leading-none text-ink">
                Keep the right chain moving.
              </h1>
            </div>
            <p className="max-w-md text-sm leading-6 text-ink/66">
              Active rounds show only your own outbound links. Completed rounds open
              the full graph.
            </p>
          </div>

          {rounds.length === 0 ? (
            <div className="ink-panel p-8">
              <p className="text-sm leading-7 text-ink/68">
                You have not started or joined any rounds yet. Create one above to
                lay down the first node.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {rounds.map((round) => (
                <article key={round.slug} className="ink-panel p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                        Round {round.slug}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-ink">
                        {round.myDisplayName}
                      </h2>
                    </div>
                    <span className="status-pill">
                      {round.status === "completed" ? "Complete" : "Active"}
                    </span>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-black/8 bg-white/72 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                        Friends
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-ink">
                        {round.totalParticipants}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-black/8 bg-white/72 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-ink/48">
                        Invites sent
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-ink">
                        {round.invitesSent}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-ink/66">
                    Started {formatTimestamp(round.createdAt)}
                    {round.completedAt
                      ? ` • Closed ${formatTimestamp(round.completedAt)}`
                      : ""}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href={roundPath(round.slug)} className="ink-button">
                      Open round
                    </Link>
                    {round.status === "completed" ? (
                      <Link
                        href={roundGraphPath(round.slug)}
                        className="ink-button-secondary"
                      >
                        Final graph
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
