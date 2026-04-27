import type { ReactNode } from "react";

type Principle = {
  title: string;
  body: string;
  note: string;
};

const principles: Principle[] = [
  {
    title: "Host with care",
    body: "The host gets gentle framing, clear status, and a calm sense of who is holding the next invitation.",
    note: "Feels more like hosting dinner than launching a funnel.",
  },
  {
    title: "Keep the stakes kind",
    body: "Copy explains what matters in human terms: invite one person, keep the chain moving, wait for the shared payoff.",
    note: "No hard metrics as the main emotional driver.",
  },
  {
    title: "Celebrate the close",
    body: "The successful loop reads as a communal moment. The graph reveal feels like everybody gathering at once.",
    note: "Warmth should peak when the round becomes visible.",
  },
];

const moments = [
  {
    label: "Starting note",
    title: "Name the round like a real plan",
    body: "A title such as Friday dumpling night or rooftop movie club grounds the chain in a real social reason to pass it on.",
  },
  {
    label: "In the chat",
    title: "The handoff stays lightweight",
    body: "The UI should suggest that someone forwards a link because they want another person in the circle, not because they are operating a growth mechanic.",
  },
  {
    label: "Near the finish",
    title: "Everyone senses a gathering",
    body: "The route preview hints at momentum, then saves the full picture for the closing moment so the reveal still feels earned.",
  },
];

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-[1.75rem] border border-white/65 bg-white/72 p-6 shadow-[0_20px_50px_rgba(117,63,39,0.08)] backdrop-blur-sm ${className}`}
    >
      {children}
    </article>
  );
}

export function HearthPrinciples() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {principles.map((item) => (
        <SectionCard key={item.title}>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#a0674a]">
            Concept E principle
          </p>
          <h2 className="mt-4 text-[1.8rem] font-semibold tracking-tight text-[#46271d]">
            {item.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#694c40]">{item.body}</p>
          <p className="mt-6 border-t border-[#edd7c8] pt-4 text-sm leading-6 text-[#8c695a]">
            {item.note}
          </p>
        </SectionCard>
      ))}
    </section>
  );
}

export function HearthMoments() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <SectionCard className="bg-[linear-gradient(180deg,rgba(255,248,242,0.82),rgba(255,239,226,0.92))]">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#a0674a]">
          Journey framing
        </p>
        <h2 className="mt-4 max-w-xl text-[2.4rem] font-semibold leading-[1.02] tracking-tight text-[#46271d]">
          Each step should read like people making space for one another.
        </h2>
        <div className="mt-8 space-y-4">
          {moments.map((moment) => (
            <div
              key={moment.title}
              className="rounded-[1.4rem] border border-white/70 bg-white/72 p-5"
            >
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a0674a]">
                {moment.label}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#4d2c20]">
                {moment.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#6b4d41]">{moment.body}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-4">
        <SectionCard>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#a0674a]">
            Host glance
          </p>
          <h3 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-[#46271d]">
            A softer control surface
          </h3>
          <div className="mt-6 space-y-3">
            {[
              "Who still has a fresh link",
              "Who just joined the chain",
              "Whether the round feels alive tonight",
            ].map((line) => (
              <div
                key={line}
                className="flex items-center gap-3 rounded-[1.2rem] border border-[#efd9ca] bg-[#fffaf6] px-4 py-3 text-sm text-[#6b4d41]"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#d68157]" />
                {line}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,rgba(209,120,73,0.94),rgba(145,79,51,0.94))] text-white shadow-[0_24px_60px_rgba(112,58,33,0.22)]">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-white/72">
            Emotional target
          </p>
          <h3 className="mt-3 text-[1.85rem] font-semibold leading-tight tracking-tight">
            Make the reveal feel like the room just filled up.
          </h3>
          <p className="mt-4 text-sm leading-7 text-white/78">
            Hearth should feel warmer, more neighborly, and less gamified than
            a typical network visualization.
          </p>
        </SectionCard>
      </div>
    </section>
  );
}
