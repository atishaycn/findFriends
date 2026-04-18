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
    <main className="loop-shell min-h-screen pb-28">
      <SiteHeader userEmail={user.email} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              Dashboard
            </p>
            <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Your Loops
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              Active chains stay mysterious. Closed ones unlock the full social map.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="loop-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Total loops
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{rounds.length}</p>
            </div>
            <div className="loop-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Active now
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{activeRounds}</p>
            </div>
            <div className="loop-card p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Signed in as
              </p>
              <p className="mt-3 break-all text-sm leading-6 text-slate-600">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        <CreateRoundCard suggestedName={suggestDisplayName(user.email)} />

        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Active and revealed
              </p>
              <h2 className="mt-2 font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
                Pick the Loop you want to open.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-600">
              Active Loops show the mystery. Revealed ones give you the map.
            </p>
          </div>

          {rounds.length === 0 ? (
            <div className="loop-card p-8">
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Nothing is moving yet. Start a Loop and send the first handoff.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {rounds.map((round) => (
                <article key={round.slug} className="loop-card flex flex-col gap-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                        Loop {round.slug}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950">
                        {round.prompt ?? "Untitled Loop"}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Started by {round.myDisplayName}
                      </p>
                    </div>
                    <span
                      className={`loop-status ${
                        round.status === "completed"
                          ? "loop-status-complete"
                          : "loop-status-active"
                      }`}
                    >
                      {round.status === "completed" ? "Revealed" : "Active"}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Chain size
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950">
                        {round.totalParticipants}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Links sent
                      </p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950">
                        {round.invitesSent}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-7 text-slate-600">
                    Started {formatTimestamp(round.createdAt)}
                    {round.completedAt
                      ? ` • Closed ${formatTimestamp(round.completedAt)}`
                      : ""}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={roundPath(round.slug)} className="loop-button">
                      {round.status === "completed" ? "Open Loop" : "Keep it moving"}
                    </Link>
                    {round.status === "completed" ? (
                      <Link
                        href={roundGraphPath(round.slug)}
                        className="loop-button-secondary"
                      >
                        View Map
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
