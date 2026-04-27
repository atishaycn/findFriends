type Node = {
  name: string;
  role: string;
  tone: string;
  style: string;
  x: string;
  y: string;
};

const nodes: Node[] = [
  {
    name: "Maya",
    role: "claims the first invite",
    tone: "Warm handoff",
    style: "border-rose-200/80 bg-white/72 text-rose-950",
    x: "20%",
    y: "22%",
  },
  {
    name: "Jordan",
    role: "passes it into brunch chat",
    tone: "Keeps it moving",
    style: "border-amber-200/80 bg-amber-50/88 text-amber-950",
    x: "78%",
    y: "14%",
  },
  {
    name: "Imani",
    role: "adds a roommate",
    tone: "New branch",
    style: "border-orange-200/80 bg-orange-50/88 text-orange-950",
    x: "76%",
    y: "58%",
  },
  {
    name: "Luis",
    role: "closes the circle",
    tone: "Reveal moment",
    style: "border-stone-200/80 bg-stone-50/92 text-stone-950",
    x: "22%",
    y: "68%",
  },
];

export function HearthPreview() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,251,247,0.95),rgba(252,242,232,0.92))] p-5 shadow-[0_28px_80px_rgba(117,63,39,0.12)] sm:p-7">
      <div className="absolute inset-x-8 top-0 h-24 rounded-b-[999px] bg-[radial-gradient(circle_at_center,rgba(255,181,125,0.28),transparent_72%)]" />
      <div className="relative rounded-[1.75rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,245,236,0.95),rgba(248,231,218,0.88))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#9d6648]">
              Hearth preview
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#4f2d20] sm:text-[2rem]">
              Friday dumpling night
            </h2>
          </div>
          <div className="rounded-full border border-[#e9c9b5] bg-white/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#88543b]">
            hidden until close
          </div>
        </div>

        <div className="relative mt-6 min-h-[25rem] rounded-[1.5rem] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(255,206,169,0.36),transparent_34%),linear-gradient(180deg,rgba(255,252,248,0.96),rgba(252,238,227,0.92))] px-4 py-5">
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="hearth-loop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(217,120,74,0.26)" />
                <stop offset="100%" stopColor="rgba(156,93,62,0.58)" />
              </linearGradient>
            </defs>
            <path
              d="M49 25 C31 24, 18 28, 17 37"
              fill="none"
              stroke="url(#hearth-loop)"
              strokeDasharray="5 7"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M51 25 C63 20, 77 24, 81 33"
              fill="none"
              stroke="url(#hearth-loop)"
              strokeDasharray="5 7"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M53 58 C66 60, 77 64, 79 71"
              fill="none"
              stroke="url(#hearth-loop)"
              strokeDasharray="5 7"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M47 59 C33 60, 20 66, 19 74"
              fill="none"
              stroke="url(#hearth-loop)"
              strokeDasharray="5 7"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <path
              d="M20 74 C34 85, 65 86, 79 71"
              fill="none"
              stroke="rgba(192,102,57,0.82)"
              strokeLinecap="round"
              strokeWidth="2.2"
            />
          </svg>

          <article className="relative mx-auto flex max-w-[15rem] flex-col gap-3 rounded-[1.6rem] border border-[#edceb8] bg-white/78 p-4 text-center shadow-[0_20px_45px_rgba(140,81,52,0.12)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#d78757,#a95a39)] text-lg font-semibold text-white shadow-[0_12px_30px_rgba(171,93,57,0.28)]">
              S
            </div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#9d6648]">
                Host
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#4f2d20]">
                Sunny starts the round
              </h3>
            </div>
            <p className="text-sm leading-6 text-[#7a5849]">
              The center feels like a gathering point, not an admin dashboard.
            </p>
          </article>

          {nodes.map((node) => (
            <article
              key={node.name}
              className={`absolute w-[8.75rem] -translate-x-1/2 -translate-y-1/2 rounded-[1.3rem] border p-3 shadow-[0_18px_38px_rgba(132,75,46,0.1)] sm:w-[11rem] ${node.style}`}
              style={{ left: node.x, top: node.y }}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] opacity-60">
                {node.tone}
              </p>
              <h4 className="mt-2 text-lg font-semibold tracking-tight">{node.name}</h4>
              <p className="mt-1 text-sm leading-5 opacity-80">{node.role}</p>
            </article>
          ))}

          <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-[#edd3c2] bg-white/76 p-4 shadow-[0_18px_40px_rgba(124,70,43,0.1)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#9d6648]">
                  Closing moment
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6a4a3c]">
                  The warm accent line marks the one real loop, then the full
                  graph opens for everyone in the round.
                </p>
              </div>
              <div className="rounded-full bg-[linear-gradient(135deg,#c86943,#e9a06b)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_28px_rgba(173,97,58,0.2)]">
                reveal together
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
