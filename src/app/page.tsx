import Link from "next/link";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { SiteHeader } from "@/components/layout/site-header";
import { StaticNetwork } from "@/components/layout/static-network";
import { getCurrentUser } from "@/lib/auth";
import { getPublicEnv } from "@/lib/env";
import { studioPath } from "@/lib/routes";

function readNextPath(
  value: string | string[] | undefined,
  fallback: string,
) {
  if (typeof value === "string" && value.startsWith("/")) {
    return value;
  }

  return fallback;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const query = await searchParams;
  const nextPath = readNextPath(query.next, studioPath());
  const user = await getCurrentUser();
  const publicEnv = getPublicEnv();

  return (
    <main className="paper-grid min-h-screen">
      <SiteHeader userEmail={user?.email} />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-8 sm:px-8 sm:py-10">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8 py-4">
            <div className="inline-flex rounded-full border border-white/14 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
              group chat energy, mapped
            </div>
            <div className="space-y-5">
              <p className="font-display text-5xl leading-none text-white sm:text-7xl lg:text-[7rem]">
                findFriends
              </p>
              <h1 className="max-w-3xl font-display text-5xl leading-[0.9] text-ink sm:text-6xl lg:text-[5.4rem]">
                Turn one invite into a social chain reaction.
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                findFriends starts a round, passes the link forward, and waits
                for the moment the loop closes and the full friend map lights up.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? studioPath() : "#sign-in"} className="ink-button">
                {user ? "Open studio" : "Start a round"}
              </Link>
              <a href="#how-it-works" className="ink-button-secondary">
                See how it plays
              </a>
            </div>
            <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                One person per node
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                Works in any group chat
              </div>
              <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
                Hidden map until the loop hits
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="hero-orbit p-6 sm:p-8">
              <div className="absolute inset-0">
                <div className="absolute left-[10%] top-[16%] h-20 w-20 rounded-full border border-white/18 bg-white/8" />
                <div className="absolute left-[38%] top-[12%] h-10 w-10 rounded-full bg-[rgba(255,209,102,0.8)] shadow-[0_0_30px_rgba(255,209,102,0.55)]" />
                <div className="absolute right-[14%] top-[28%] h-16 w-16 rounded-full border border-white/20 bg-[rgba(138,125,255,0.28)]" />
                <div className="absolute bottom-[14%] left-[18%] h-14 w-14 rounded-full border border-white/18 bg-[rgba(255,141,93,0.24)]" />
                <div className="absolute bottom-[18%] right-[16%] h-24 w-24 rounded-full border border-white/12 bg-white/6" />
              </div>
              <div className="relative flex h-full flex-col justify-between gap-8">
                <div className="max-w-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/60">
                    Live round preview
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
                    The best part is not knowing who closes it.
                  </p>
                </div>
                <StaticNetwork className="mx-auto w-full max-w-md" />
              </div>
            </div>

            {user ? (
              <div className="ink-panel orbital-panel p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/62">
                  Signed in
                </p>
                <h2 className="mt-3 font-display text-4xl leading-none text-ink">
                  Pick up the round before someone else closes the loop.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-7 text-white/72">
                  Your session is live. Open the studio to create a new chain or
                  jump back into a round already in motion.
                </p>
                <Link href={studioPath()} className="ink-button mt-6 inline-flex">
                  Go to studio
                </Link>
              </div>
            ) : (
              <div id="sign-in">
                <SignInPanel
                  nextPath={nextPath}
                  title="Sign in and start the mischief"
                  subtitle="Use your email so each friend only claims one node in the chain."
                  siteUrl={publicEnv.siteUrl}
                  supabaseUrl={publicEnv.supabaseUrl}
                  supabaseAnonKey={publicEnv.supabaseAnonKey}
                />
              </div>
            )}
          </div>
        </section>

        <section
          id="how-it-works"
          className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/54">
              How it works
            </p>
            <h2 className="font-display text-5xl leading-none text-ink">
              Three moves. One reveal.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Open",
                body: "Create the round and put the first node on the board.",
              },
              {
                title: "Pass",
                body: "Each friend claims the link, then hands a new one to someone else.",
              },
              {
                title: "Reveal",
                body: "The first real loop locks the round and unlocks the graph for everyone inside it.",
              },
            ].map((step, index) => (
              <article
                key={step.title}
                className="ink-panel orbital-panel flex min-h-56 flex-col justify-between p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/48">
                  0{index + 1}
                </p>
                <div>
                  <h3 className="font-display text-4xl leading-none text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/72">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
