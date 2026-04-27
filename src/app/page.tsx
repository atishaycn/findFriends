import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CompassTool,
  LinkSimple,
  Pulse,
  Queue,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";
import { SignInPanel } from "@/components/auth/sign-in-panel";
import { RoundPreview } from "@/components/layout/round-preview";
import { SiteHeader } from "@/components/layout/site-header";
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
  const user = await getCurrentUser();
  const publicEnv = getPublicEnv();
  const nextPath = readNextPath(query.next, studioPath());

  return (
    <main className="page-shell">
      <SiteHeader userEmail={user?.email} />
      <section className="hero-stage">
        <div className="content-wrap">
          <div className="hero-grid">
            <div className="hero-column lg:pb-14">
              <div className="stagger-rise space-y-5" style={{ ["--index" as string]: 0 }}>
                <div className="capsule">
                  <span className="dot-pulse" />
                  Built for live group chats
                </div>
                <div className="space-y-3">
                  <div className="brand-mark">findFriends</div>
                  <h1 className="headline hero-copy font-semibold text-balance text-ink">
                    Let one invite drift through your circle until the hidden shape snaps into view.
                  </h1>
                </div>
                <p className="hero-support">
                  Start a round, pass one fresh link to one friend, and let the
                  chain travel through the same messages your group already uses.
                  The graph stays partially concealed until a real closing loop
                  lands.
                </p>
              </div>

              <div className="stagger-rise flex flex-wrap gap-3" style={{ ["--index" as string]: 1 }}>
                <Link href={user ? studioPath() : "#sign-in"} className="primary-button">
                  <ArrowRight size={18} weight="bold" />
                  {user ? "Open my studio" : "Start a round"}
                </Link>
                <a href="#how-it-works" className="secondary-button">
                  See the chain
                </a>
              </div>

              <div className="hero-stack">
                <div
                  className="stagger-rise rail-note max-w-xl space-y-3"
                  style={{ ["--index" as string]: 2 }}
                >
                  <div className="step-kicker">
                    <span className="eyebrow-line" />
                    <p className="eyebrow">The round works because it stays incomplete</p>
                  </div>
                  <p className="text-sm leading-7 text-muted">
                    The suspense comes from partial visibility. People only know
                    their local connection until the final return makes the
                    entire path legible.
                  </p>
                </div>

                <div
                  className="stagger-rise space-y-3"
                  style={{ ["--index" as string]: 3 }}
                >
                  <div className="metric-ribbon">
                    <p className="eyebrow">Structure</p>
                    <p className="text-lg font-semibold tracking-tight text-ink">
                      Tree first. Loop once.
                    </p>
                  </div>
                  <div className="metric-ribbon">
                    <p className="eyebrow">Behavior</p>
                    <p className="text-lg font-semibold tracking-tight text-ink">
                      One link per turn keeps the story readable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:pl-8">
              <div className="hero-orbit p-4 sm:p-5">
                <RoundPreview className="float-card" />
              </div>

              <div className="ribbon-grid">
                {[
                  {
                    title: "Start clean",
                    body: "Open a round with your name, then send the first link.",
                    icon: CompassTool,
                  },
                  {
                    title: "Keep it moving",
                    body: "Every participant gets one clear next action instead of a dashboard maze.",
                    icon: Queue,
                  },
                  {
                    title: "Reveal once",
                    body: "The final loop unlocks the finished graph for everyone already inside.",
                    icon: Pulse,
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="stagger-rise metric-ribbon"
                      style={{ ["--index" as string]: index + 4 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/82 text-accent">
                          <Icon size={18} weight="bold" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-ink">{item.title}</p>
                          <p className="mt-1 text-sm leading-6 text-muted">{item.body}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {user ? (
                <section className="glass-panel max-w-xl p-6 sm:p-8">
                  <p className="eyebrow">You are signed in</p>
                  <h2 className="mt-3 text-[2rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
                    Pick up the rounds you already set in motion.
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-muted">
                    Your session is already live. Open the studio to start a new
                    round or reopen one that is still moving through the chain.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={studioPath()} className="primary-button">
                      Open studio
                    </Link>
                  </div>
                </section>
              ) : (
                <div id="sign-in" className="max-w-xl">
                  <SignInPanel
                    nextPath={nextPath}
                    title="Sign in first, then send the opening link"
                    subtitle="Use email sign-in so each person keeps a single identity all the way through the round."
                    siteUrl={publicEnv.siteUrl}
                    supabaseUrl={publicEnv.supabaseUrl}
                    supabaseAnonKey={publicEnv.supabaseAnonKey}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrap pb-16">
        <section id="how-it-works" className="story-split gap-10 pt-6">
          <div className="space-y-4">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title max-w-lg font-semibold text-balance text-ink">
              The product works best when every screen has one sentence and one move.
            </h2>
            <p className="body-copy text-sm">
              Start the round, pass the next link, and wait for the closing
              return. That is enough structure to make the final reveal matter.
            </p>
          </div>
          <div className="story-board">
            {[
              {
                title: "Start the round",
                body: "Pick your display name and become the first visible person in the chain.",
                icon: UsersThree,
              },
              {
                title: "Pass one fresh link",
                body: "Send one new link to one friend in the same chats you already use every day.",
                icon: LinkSimple,
              },
              {
                title: "Open the finished graph",
                body: "When the first valid loop closes, everyone already inside can finally see the full shape.",
                icon: CheckCircle,
              },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="step-band stagger-rise"
                  style={{ ["--index" as string]: index }}
                >
                  <div className="step-kicker">
                    <div className="rounded-full border border-line bg-white/70 p-3 text-accent">
                      <Icon size={18} weight="bold" />
                    </div>
                    <p className="eyebrow">0{index + 1}</p>
                  </div>
                  <div>
                    <h3 className="text-[1.55rem] font-semibold tracking-tight text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted">{step.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-5">
            <p className="eyebrow">The one rule that matters</p>
            <h2 className="section-title max-w-2xl font-semibold text-balance text-ink">
              A round finishes only when the return path is genuinely unexpected.
            </h2>
            <div className="quiet-panel space-y-6">
              <div className="grid gap-3 md:grid-cols-[0.76fr_1.24fr]">
                <p className="text-sm font-semibold text-ink">Counts as a finish</p>
                <p className="text-sm leading-7 text-muted">
                  The link reaches someone who is already in the round, but not
                  the sender and not the person who brought the sender in.
                </p>
              </div>
              <div className="grid gap-3 border-t border-[rgba(34,29,23,0.1)] pt-6 md:grid-cols-[0.76fr_1.24fr]">
                <p className="text-sm font-semibold text-ink">Only a warning</p>
                <p className="text-sm leading-7 text-muted">
                  The link goes straight back to the sender or straight back to
                  the sender’s parent. That path is too direct to count.
                </p>
              </div>
            </div>
          </div>

          <div className="paper-panel overflow-hidden p-0">
            <div className="p-6 sm:p-8">
              <p className="eyebrow">Designed for phones first</p>
              <h3 className="mt-3 text-[2rem] font-semibold tracking-tight text-ink">
                Most people will enter from a message thread, not a desktop dashboard.
              </h3>
            </div>
            <div className="section-rule grid gap-0">
              {[
                "Clear next step near the top of every screen",
                "Copy and share actions built for chat apps",
                "Simple wording instead of game jargon",
              ].map((line, index) => (
                <div
                  key={line}
                  className="stagger-rise flex items-center gap-3 px-6 py-4 sm:px-8"
                  style={{ ["--index" as string]: index }}
                >
                  <Pulse size={16} weight="fill" className="text-accent" />
                  <p className="text-sm leading-7 text-muted">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
