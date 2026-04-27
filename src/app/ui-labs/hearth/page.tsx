import Link from "next/link";
import type { Metadata } from "next";
import { HearthPreview } from "./hearth-preview";
import { HearthMoments, HearthPrinciples } from "./hearth-sections";

export const metadata: Metadata = {
  title: "Friend Graph UI Lab - Hearth",
  description:
    "Concept E for Friend Graph: a warmer, community-centered route that frames the graph like a shared gathering.",
};

const cues = [
  "Warmer community-centered presentation",
  "Soft gradients and lighter emotional contrast",
  "Human-centered copy instead of product language",
];

export default function HearthPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#f7efe5] text-[#43251c]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] h-[20rem] w-[20rem] rounded-full bg-[radial-gradient(circle,rgba(255,192,143,0.34),transparent_68%)] blur-2xl" />
        <div className="absolute right-[-5rem] top-[4rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(226,150,111,0.26),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-8rem] left-[20%] h-[18rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,229,196,0.6),transparent_72%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent_20%,rgba(255,245,236,0.48)_100%)]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 sm:py-8 lg:gap-14 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/65 bg-white/56 px-5 py-3 shadow-[0_12px_36px_rgba(134,78,48,0.08)] backdrop-blur-md">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.34em] text-[#9d6648]">
              UI lab / concept e
            </p>
            <p className="mt-1 text-sm text-[#6f4d3f]">
              Hearth is the warm, neighborly direction for Friend Graph.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-full border border-[#e7cbb9] bg-white/72 px-4 py-2 text-sm font-semibold text-[#684638] transition hover:-translate-y-px hover:bg-white"
            >
              Home
            </Link>
            <Link
              href="/studio"
              className="rounded-full bg-[linear-gradient(135deg,#cb7348,#e6a169)] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(173,97,58,0.2)] transition hover:-translate-y-px hover:shadow-[0_22px_40px_rgba(173,97,58,0.24)]"
            >
              Open studio
            </Link>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-[#ecd4c4] bg-white/70 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#9d6648] shadow-[0_10px_24px_rgba(138,82,52,0.06)]">
              Friend Graph / Hearth
            </div>
            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.05em] text-[#4a291e] sm:text-6xl lg:text-[5.4rem]">
                A friend graph that feels like a gathering, not a system.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#6d4d40] sm:text-lg">
                Concept E shifts the route toward warmth and belonging. The host
                feels like they are inviting people into a shared plan, the chain
                feels alive without becoming loud, and the closing reveal lands
                like everyone finally arriving at the same place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {cues.map((cue) => (
                <div
                  key={cue}
                  className="rounded-[1.5rem] border border-white/70 bg-white/64 p-4 text-sm leading-6 text-[#6d4d40] shadow-[0_16px_38px_rgba(126,72,43,0.06)]"
                >
                  {cue}
                </div>
              ))}
            </div>

            <div className="rounded-[1.85rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,252,249,0.9),rgba(255,241,229,0.9))] p-6 shadow-[0_22px_55px_rgba(114,62,37,0.08)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#a0674a]">
                Copy direction
              </p>
              <p className="mt-4 text-xl font-semibold tracking-tight text-[#4b2b20]">
                &ldquo;Pass this to one person you want in the circle.&rdquo;
              </p>
              <p className="mt-3 text-sm leading-7 text-[#6d4d40]">
                The language stays close to real social behavior: passing,
                inviting, waiting, gathering, and revealing together.
              </p>
            </div>
          </div>

          <HearthPreview />
        </section>

        <HearthPrinciples />

        <HearthMoments />

        <section className="grid gap-4 rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,248,242,0.86),rgba(248,232,221,0.96))] p-6 shadow-[0_24px_60px_rgba(117,63,39,0.08)] lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#a0674a]">
              Distinctive qualities
            </p>
            <h2 className="mt-3 max-w-2xl text-[2.3rem] font-semibold leading-[1.02] tracking-tight text-[#46271d]">
              Hearth is intentionally softer, brighter, and more human than the
              default Friend Graph presentation.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b4d41]">
              The route stands on its own as a UI-lab artifact, with a dedicated
              palette, warmer narrative framing, and local-only components inside
              this subtree.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              "Use creamy surfaces instead of dark glass.",
              "Favor invitation language over network jargon.",
              "Make the reveal feel communal rather than competitive.",
            ].map((line) => (
              <div
                key={line}
                className="rounded-[1.3rem] border border-[#ecd5c5] bg-white/74 px-4 py-4 text-sm leading-6 text-[#6a4a3c]"
              >
                {line}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
