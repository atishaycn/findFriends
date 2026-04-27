import Link from "next/link";
import { ArrowRight, ChartLine, LinkSimple, UserCircle } from "@phosphor-icons/react/dist/ssr";
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
    <main className="app-shell">
      <SiteHeader userEmail={user.email} />
      <div className="page-frame flex flex-col gap-6 md:gap-8">
        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col gap-4 py-4">
            <p className="section-kicker">
              Studio
            </p>
            <h1 className="page-title max-w-[12ch]">
              Keep active rounds moving without turning the app into noise.
            </h1>
            <p className="body-copy">
              Start a fresh chain, watch the ones you already touched, and jump
              to the final map the moment one of them closes.
            </p>
          </div>
          <div className="glass-panel grid gap-2 p-4 md:p-5">
            {[
              {
                label: "Total rounds",
                value: String(rounds.length),
                icon: ChartLine,
              },
              {
                label: "Active now",
                value: String(activeRounds),
                icon: LinkSimple,
              },
              {
                label: "Signed in as",
                value: user.email ?? "",
                icon: UserCircle,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-[var(--line)] bg-white/56 px-4 py-4"
              >
                <div>
                  <p className="section-kicker">{item.label}</p>
                  <p className={`${item.label === "Signed in as" ? "mt-2 break-all text-sm leading-6 text-[var(--muted)]" : "metric-value mt-2"}`}>
                    {item.value}
                  </p>
                </div>
                <div className="rounded-full bg-[rgba(47,108,87,0.1)] p-3 text-[var(--accent)]">
                  <item.icon size={18} weight="duotone" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <CreateRoundCard suggestedName={suggestDisplayName(user.email)} />

        <section className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4 pt-1">
            <p className="section-kicker">Your rounds</p>
            <h2 className="section-title max-w-[10ch]">
              Re-enter the thread you want to push forward.
            </h2>
            <p className="body-copy">
              Active rounds keep the graph private. Completed rounds expose the
              final network and the closing edge.
            </p>
          </div>

          {rounds.length === 0 ? (
            <div className="glass-panel flex min-h-72 flex-col justify-between p-6 md:p-7">
              <div>
                <p className="section-kicker">Empty state</p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)]">
                  Nothing is in motion yet.
                </h3>
                <p className="body-copy mt-4">
                  Create your first round above. The studio will start filling
                  with active chains and finished reveals as people claim links.
                </p>
              </div>
              <div className="soft-panel p-5 text-sm leading-7 text-[var(--muted)]">
                Start with a display name that feels recognizable to your group.
              </div>
            </div>
          ) : (
            <div className="glass-panel overflow-hidden p-2 md:p-3">
              <div className="divider-list">
                {rounds.map((round) => (
                  <article
                    key={round.slug}
                    className="grid gap-5 px-4 py-5 md:grid-cols-[1.1fr_0.9fr] md:px-5"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="status-pill">
                          <span className="status-dot" />
                          {round.status === "completed" ? "Complete" : "Active"}
                        </span>
                        <span className="section-kicker">Round {round.slug}</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
                          {round.myDisplayName}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                          Started {formatTimestamp(round.createdAt)}
                          {round.completedAt
                            ? ` • closed ${formatTimestamp(round.completedAt)}`
                            : " • still collecting claims"}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr] md:items-end">
                      <div className="space-y-3">
                        <div>
                          <p className="section-kicker">Friends</p>
                          <p className="metric-value">{round.totalParticipants}</p>
                        </div>
                        <div>
                          <p className="section-kicker">Invites sent</p>
                          <p className="metric-value">{round.invitesSent}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 md:justify-end">
                        <Link href={roundPath(round.slug)} className="primary-button">
                          Open round
                          <ArrowRight size={16} weight="bold" />
                        </Link>
                        {round.status === "completed" ? (
                          <Link
                            href={roundGraphPath(round.slug)}
                            className="secondary-button"
                          >
                            Final graph
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
