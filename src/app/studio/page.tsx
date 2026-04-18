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
  const activeRounds = rounds.filter((round) => round.status === "active").length;

  return (
    <main className="paper-grid min-h-screen">
      <SiteHeader userEmail={user.email} />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/54">
              Studio
            </p>
            <h1 className="font-display text-5xl leading-[0.92] text-ink sm:text-6xl lg:text-7xl">
              Keep your rounds playful, not chaotic.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-white/70">
              Start a fresh chain, track the ones you already touched, and jump to
              the final graph as soon as one closes.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="ink-panel p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/46">
                Total rounds
              </p>
              <p className="mt-3 text-4xl font-semibold text-ink">{rounds.length}</p>
            </div>
            <div className="ink-panel p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/46">
                Active now
              </p>
              <p className="mt-3 text-4xl font-semibold text-ink">{activeRounds}</p>
            </div>
            <div className="ink-panel p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/46">
                Signed in as
              </p>
              <p className="mt-3 break-all text-sm leading-6 text-white/74">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        <CreateRoundCard suggestedName={suggestDisplayName(user.email)} />

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/54">
                Your rounds
              </p>
              <h2 className="mt-2 font-display text-5xl leading-none text-ink">
                Pick the thread you want to keep alive.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/66">
              Active rounds only expose your own outbound links. Completed ones
              unlock the full network and the final reveal.
            </p>
          </div>

          {rounds.length === 0 ? (
            <div className="ink-panel orbital-panel p-8">
              <p className="max-w-xl text-sm leading-7 text-white/72">
                Nothing is in motion yet. Create a round above and start the first
                pass.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {rounds.map((round) => (
                <article
                  key={round.slug}
                  className="ink-panel orbital-panel flex flex-col gap-5 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/52">
                        Round {round.slug}
                      </p>
                      <h3 className="mt-2 font-display text-4xl leading-none text-ink">
                        {round.myDisplayName}
                      </h3>
                    </div>
                    <span className="status-pill">
                      {round.status === "completed" ? "Complete" : "Active"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/46">
                        Friends
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-ink">
                        {round.totalParticipants}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/46">
                        Invites sent
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-ink">
                        {round.invitesSent}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-white/66">
                    Started {formatTimestamp(round.createdAt)}
                    {round.completedAt
                      ? ` • Closed ${formatTimestamp(round.completedAt)}`
                      : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
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
