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
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-10 sm:px-8 sm:py-14">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex rounded-full border border-black/10 bg-white/66 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              One round. One closing loop.
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-display text-6xl leading-[0.92] text-ink sm:text-7xl lg:text-[6.5rem]">
                Build a friend chain and reveal the hidden map.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-ink/72 sm:text-lg">
                findFriends lets one invite travel from friend to friend, and the
                fun is that nobody sees the full connection map until the chain
                loops back and unlocks it.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/46">
                  Identity
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/76">
                  Magic-link email keeps one person tied to one node.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/46">
                  Sharing
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/76">
                  Every link is manual, so it works in any chat thread.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/8 bg-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/46">
                  Reveal
                </p>
                <p className="mt-3 text-sm leading-6 text-ink/76">
                  The full graph stays hidden until the valid loop closes.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <StaticNetwork className="w-full max-w-xl" />
            {user ? (
              <div className="ink-panel p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                  Signed in
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">
                  Pick up your current rounds.
                </h2>
                <p className="mt-3 text-sm leading-6 text-ink/68">
                  Your magic link session is active. Open the studio to start a new
                  round or continue an existing one.
                </p>
                <Link href={studioPath()} className="ink-button mt-6 inline-flex">
                  Open studio
                </Link>
              </div>
            ) : (
              <SignInPanel
                nextPath={nextPath}
                supabaseUrl={publicEnv.supabaseUrl}
                supabaseAnonKey={publicEnv.supabaseAnonKey}
              />
            )}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "1. Start the chain",
              body: "Create a round, choose your display name, and generate the first invite from your node.",
            },
            {
              title: "2. Pass it forward",
              body: "Each friend claims their spot, then sends a fresh invite to someone else instead of replying backward.",
            },
            {
              title: "3. Catch the loop",
              body: "The first valid connection back to an earlier participant locks the round and reveals the final graph.",
            },
          ].map((step) => (
            <article key={step.title} className="ink-panel p-6">
              <h2 className="font-display text-3xl leading-none text-ink">
                {step.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-ink/68">{step.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
