import {
  ArrowRight,
  LinkSimpleHorizontal,
  Path,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { SiteHeader } from "@/components/layout/site-header";
import { StaticNetwork } from "@/components/layout/static-network";
import { LiveSignalBoard } from "@/components/motion/live-signal-board";
import { MagneticLink } from "@/components/motion/magnetic-link";
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
    <main className="app-shell">
      <SiteHeader userEmail={user?.email} />
      <div className="page-frame flex flex-col gap-10 md:gap-14">
        <section className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="flex min-h-[100dvh] flex-col justify-between gap-10 pb-6 pt-4 md:pb-10">
            <div className="space-y-8">
              <div className="chip-row">
                <Sparkle size={15} weight="fill" className="text-[var(--accent)]" />
                Private until the loop closes
              </div>
              <div className="space-y-6">
                <p className="section-kicker">findFriends rebuilt as Loop</p>
                <h1 className="page-title max-w-[10ch]">
                  Start the chain. Hide the map. Reveal the whole room later.
                </h1>
                <p className="body-copy max-w-[56ch]">
                  Loop turns one invite into a quiet social experiment. Every friend
                  claims a node, passes the link forward, and only the final,
                  legitimate circle unlocks the full graph.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <MagneticLink href={user ? studioPath() : "#sign-in"}>
                  {user ? "Open studio" : "Start a round"}
                  <ArrowRight size={16} weight="bold" />
                </MagneticLink>
                <MagneticLink href="#how-it-works" variant="secondary">
                  See the flow
                </MagneticLink>
              </div>
            </div>

            <div className="grid gap-3 md:max-w-[36rem] md:grid-cols-[1.1fr_0.9fr]">
              <div className="glass-panel p-5">
                <p className="section-kicker">What stays hidden</p>
                <p className="mt-3 text-xl font-semibold tracking-tight text-[var(--ink)]">
                  Nobody sees the full graph while the chain is still alive.
                </p>
              </div>
              <div className="soft-panel p-5">
                <p className="section-kicker">What changes instantly</p>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                  A valid closing edge locks the round and reveals the final shape to
                  everyone already inside.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:pt-[5vh]">
            <div className="hero-slab p-5 md:p-7">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-md">
                    <p className="section-kicker">Asymmetric signal board</p>
                    <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] md:text-3xl">
                      Built to feel alive without exposing the answer too early.
                    </p>
                  </div>
                  <div className="chip-row">
                    <LinkSimpleHorizontal size={15} className="text-[var(--accent)]" />
                    One person per node
                  </div>
                </div>
                <LiveSignalBoard />
              </div>
            </div>

            {user ? (
              <div className="glass-panel p-6 md:p-7">
                <p className="section-kicker">
                  Signed in
                </p>
                <h2 className="section-title mt-3 max-w-[12ch]">
                  Pick up your active rounds before somebody else closes one.
                </h2>
                <p className="body-copy mt-4">
                  Your session is live. The studio is where new chains start and
                  active ones keep moving.
                </p>
                <div className="mt-6">
                  <MagneticLink href={studioPath()}>
                    Go to studio
                    <ArrowRight size={16} weight="bold" />
                  </MagneticLink>
                </div>
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

        <section id="how-it-works" className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-4 pt-2">
            <p className="section-kicker">
              How it works
            </p>
            <h2 className="section-title max-w-[10ch]">
              Three moves. One locked reveal.
            </h2>
            <p className="body-copy">
              The product only works if the mystery holds. Each stage keeps the
              social mechanic clear without leaking the whole picture too soon.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            {[
              {
                title: "Open a private round",
                body: "Start the first node, generate the first link, and keep the graph hidden while the chain begins.",
                icon: Path,
              },
              {
                title: "Pass it forward",
                body: "Each friend claims a single node, then sends a fresh invite to someone new instead of bouncing backward.",
                icon: LinkSimpleHorizontal,
              },
              {
                title: "Reveal the final map",
                body: "A legitimate loop locks the round and unlocks the full network for everyone already inside it.",
                icon: Sparkle,
              },
            ].map((step, index) => (
              <article
                key={step.title}
                className={`${index === 2 ? "md:col-span-2" : ""} glass-panel flex min-h-56 flex-col justify-between p-6 md:p-7`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="chip-row">
                    <step.icon size={15} className="text-[var(--accent)]" />
                    Step 0{index + 1}
                  </div>
                  <span className="font-mono text-sm text-[rgba(18,23,20,0.38)]">
                    0{index + 1}
                  </span>
                </div>
                <div className="mt-10">
                  <h3 className="text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-sm leading-7 text-[var(--muted)]">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.76fr_1.24fr]">
          <div className="glass-panel flex flex-col justify-between gap-8 p-6 md:p-7">
            <div>
              <p className="section-kicker">Static preview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
                The final structure feels clean because the work stayed hidden until the end.
              </h2>
            </div>
            <StaticNetwork className="w-full max-w-lg" />
          </div>
          <div className="glass-panel p-6 md:p-7">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Every invite is attributable to a single participant.",
                "Direct send-backs are warnings, not a valid closure.",
                "Any group chat works because the link is the transport layer.",
                "Finished rounds unlock a clean graph instead of a noisy feed.",
              ].map((line) => (
                <div key={line} className="soft-panel p-5 text-sm leading-7 text-[var(--muted)]">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
