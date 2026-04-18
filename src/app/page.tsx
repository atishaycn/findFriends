import Link from "next/link";
import { SignInPanel } from "@/components/auth/sign-in-panel";
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
  const nextPath = readNextPath(query.next, studioPath());
  const user = await getCurrentUser();
  const publicEnv = getPublicEnv();

  return (
    <main className="loop-shell min-h-screen">
      <SiteHeader userEmail={user?.email} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-8 sm:px-8 sm:py-12">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8 py-4">
            <div className="inline-flex rounded-full border border-indigo-200 bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-700 shadow-sm">
              A chain reaction for friends
            </div>
            <div className="space-y-5">
              <p className="font-display text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">
                Loop
              </p>
              <h1 className="max-w-3xl font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-[4.6rem]">
                Start the loop. Pass the mystery. See the map when it closes.
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                A shared link moves from friend to friend. Nobody sees the chain until
                it comes back to someone already inside it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? studioPath() : "#sign-in"} className="loop-button">
                {user ? "Open Your Loops" : "Send Magic Link"}
              </Link>
              <a href="#how-it-works" className="loop-button-secondary">
                See how it works
              </a>
            </div>
          </div>

          <div className="hero-loop">
            <div className="grid gap-4">
              <div className="loop-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Phase 1
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  Create a prompt and send one link.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="loop-card p-5">
                  <p className="text-sm font-semibold text-slate-950">Phase 2</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Each person joins, gets a new forwarding link, and keeps the chain moving.
                  </p>
                </div>
                <div className="loop-card p-5">
                  <p className="text-sm font-semibold text-slate-950">Phase 3</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    The reveal unlocks only when a participant receives the link again.
                  </p>
                </div>
              </div>
              <div className="loop-visual">
                <span className="loop-dot loop-dot-a" />
                <span className="loop-dot loop-dot-b" />
                <span className="loop-dot loop-dot-c" />
                <span className="loop-dot loop-dot-d" />
                <svg viewBox="0 0 320 180" className="h-48 w-full">
                  <path d="M50 95 C90 40, 150 32, 190 72" className="loop-line" />
                  <path d="M190 72 C232 108, 262 130, 286 92" className="loop-line" />
                  <path d="M286 92 C232 150, 132 160, 50 95" className="loop-line loop-line-close" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              How it works
            </p>
            <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              Three phases. One reveal.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Spark",
                body: "Start a Loop, write a prompt, and send the first link to one person.",
              },
              {
                title: "Chain",
                body: "Each person joins, gets their own forwarding link, and sees only the count grow.",
              },
              {
                title: "Closure",
                body: "The moment the link lands on someone already inside the chain, the Loop locks and reveals the full map.",
              },
            ].map((step, index) => (
              <article key={step.title} className="loop-card flex min-h-56 flex-col justify-between p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  0{index + 1}
                </p>
                <div>
                  <h3 className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{step.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {!user ? (
          <div id="sign-in" className="mx-auto w-full max-w-xl">
            <SignInPanel
              nextPath={nextPath}
              title="A chain reaction. Start the loop. See where it goes."
              subtitle="Sign in with email to keep each participant tied to one identity."
              siteUrl={publicEnv.siteUrl}
              supabaseUrl={publicEnv.supabaseUrl}
              supabaseAnonKey={publicEnv.supabaseAnonKey}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
}
