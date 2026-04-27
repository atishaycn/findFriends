type NodeTone = "accent" | "olive" | "clay" | "stone";

type AtlasNode = {
  id: string;
  label: string;
  role: string;
  note: string;
  x: string;
  y: string;
  tone: NodeTone;
};

type AtlasLink = {
  from: string;
  to: string;
  label: string;
};

const atlasNodes: AtlasNode[] = [
  {
    id: "oriel",
    label: "Oriel",
    role: "origin",
    note: "Set the handoff in motion at 09:12",
    x: "18%",
    y: "34%",
    tone: "accent",
  },
  {
    id: "marlow",
    label: "Marlow",
    role: "relay",
    note: "Redirected the thread through the north branch",
    x: "48%",
    y: "18%",
    tone: "stone",
  },
  {
    id: "ines",
    label: "Ines",
    role: "witness",
    note: "Pinned the first proof marker",
    x: "76%",
    y: "28%",
    tone: "olive",
  },
  {
    id: "sorrel",
    label: "Sorrel",
    role: "keeper",
    note: "Logged the archive stamp and closed the loop",
    x: "67%",
    y: "68%",
    tone: "clay",
  },
  {
    id: "tavian",
    label: "Tavian",
    role: "courier",
    note: "Carried the signal through the river edge",
    x: "28%",
    y: "74%",
    tone: "stone",
  },
];

const atlasLinks: AtlasLink[] = [
  { from: "oriel", to: "marlow", label: "bearing 01" },
  { from: "marlow", to: "ines", label: "bearing 02" },
  { from: "ines", to: "sorrel", label: "bearing 03" },
  { from: "sorrel", to: "tavian", label: "bearing 04" },
  { from: "tavian", to: "oriel", label: "return" },
];

const ledgerEntries = [
  {
    sector: "North stair",
    signal: "Paper trail intact",
    status: "Stamped",
    time: "09:18",
  },
  {
    sector: "Glass hall",
    signal: "Relay changed hands",
    status: "Observed",
    time: "09:24",
  },
  {
    sector: "East annex",
    signal: "Witness mark attached",
    status: "Indexed",
    time: "09:31",
  },
  {
    sector: "River gate",
    signal: "Loop returned to source",
    status: "Closed",
    time: "09:44",
  },
] as const;

const archiveCards = [
  {
    shelf: "Drawer A",
    title: "Source Rule",
    body: "The graph stays veiled until every edge has a matching receipt.",
  },
  {
    shelf: "Drawer B",
    title: "Transfer Note",
    body: "Direct send-backs trigger a caution stripe instead of counting as a link.",
  },
  {
    shelf: "Drawer C",
    title: "Reveal Window",
    body: "Only the final atlas spread shows the full route and who completed it.",
  },
] as const;

const toneClass: Record<NodeTone, string> = {
  accent: "border-[rgba(143,96,57,0.45)] bg-[rgba(181,140,96,0.2)] text-stone-900",
  olive: "border-[rgba(97,108,83,0.42)] bg-[rgba(140,152,121,0.18)] text-stone-900",
  clay: "border-[rgba(126,89,72,0.45)] bg-[rgba(154,118,96,0.18)] text-stone-900",
  stone: "border-[rgba(122,113,98,0.38)] bg-[rgba(158,149,135,0.16)] text-stone-900",
};

export function AtlasConceptC() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#ede6d8] text-stone-900">
      <BackgroundTexture />
      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-8 px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        <TopRail />

        <section className="grid gap-4 md:gap-6 xl:grid-cols-[1.45fr_0.72fr]">
          <GraphBoard />
          <aside className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
            <SignalPanel />
            <ArchiveDrawers />
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <FieldJournal />
          <LedgerPanel />
        </section>
      </div>
    </main>
  );
}

function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 18%, rgba(129, 112, 84, 0.12), transparent 28%), radial-gradient(circle at 84% 14%, rgba(112, 124, 93, 0.12), transparent 26%), radial-gradient(circle at 52% 80%, rgba(155, 120, 89, 0.1), transparent 24%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(78, 69, 57, 0.06) 0px, rgba(78, 69, 57, 0.06) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(90deg, rgba(78, 69, 57, 0.035) 0px, rgba(78, 69, 57, 0.035) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(55, 48, 40, 0.9) 0.55px, transparent 0.8px)",
          backgroundSize: "12px 12px",
        }}
      />
    </>
  );
}

function TopRail() {
  return (
    <header className="grid gap-4 rounded-[2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(246,240,229,0.86)] p-4 shadow-[0_24px_60px_-32px_rgba(73,58,37,0.45)] backdrop-blur-sm md:grid-cols-[1.2fr_0.8fr] md:p-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-stone-500">
          <span className="rounded-full border border-[rgba(98,84,63,0.18)] px-3 py-1">
            UI Lab
          </span>
          <span className="rounded-full border border-[rgba(98,84,63,0.18)] px-3 py-1">
            Concept C
          </span>
          <span className="rounded-full border border-[rgba(98,84,63,0.18)] px-3 py-1">
            Friend Graph Atlas
          </span>
        </div>
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
            Map-room / archival direction
          </p>
          <h1 className="max-w-4xl text-4xl tracking-[-0.06em] text-stone-900 sm:text-5xl lg:text-6xl">
            A diagram-first friend graph staged like a table of routes,
            receipts, and sealed evidence.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
            The full graph reads like a marked field atlas instead of a social
            feed: quiet neutrals, stamped annotations, route bearings, and a
            controlled reveal that feels recovered rather than instantly shown.
          </p>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-stone-700 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
        <SummaryChip label="Reveal state" value="veiled" meta="until closure" />
        <SummaryChip label="Pass count" value="04" meta="logged relays" />
        <SummaryChip label="Archive mode" value="live" meta="notes attached" />
      </div>
    </header>
  );
}

function SummaryChip(props: { label: string; value: string; meta: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(255,252,246,0.72)] p-4">
      <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
        {props.label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="font-mono text-2xl tracking-[-0.06em] text-stone-900">
          {props.value}
        </p>
        <p className="text-xs text-stone-500">{props.meta}</p>
      </div>
    </div>
  );
}

function GraphBoard() {
  return (
    <section className="relative overflow-hidden rounded-[2.4rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(250,246,238,0.9)] p-4 shadow-[0_30px_80px_-36px_rgba(73,58,37,0.45)] md:p-6 lg:p-7">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(111, 98, 77, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(111, 98, 77, 0.08) 1px, transparent 1px)",
          backgroundSize: "76px 76px",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex flex-col gap-4 border-b border-[rgba(98,84,63,0.16)] pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Atlas spread
            </p>
            <h2 className="mt-2 text-2xl tracking-[-0.05em] text-stone-900 sm:text-3xl">
              Surveyed route of the current round
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-600">
            Nodes behave like pinned witness cards. Edges are labeled bearings,
            and the surface keeps the graph legible even before the final reveal.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(239,232,219,0.42)] p-3 sm:p-4">
            <GraphMap />
          </div>
          <div className="flex flex-col gap-3">
            <SideNotation
              index="A1"
              title="Bearing logic"
              body="Every handoff is labeled and time-marked so the map can stay diagrammatic instead of chat-like."
            />
            <SideNotation
              index="B2"
              title="Warning stripe"
              body="Direct back-sends can surface as caution tape on the route without being counted as completed edges."
            />
            <SideNotation
              index="C4"
              title="Reveal posture"
              body="The full spread can remain partially obscured until the final closure event removes the drafting overlay."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GraphMap() {
  return (
    <div className="relative min-h-[530px] overflow-hidden rounded-[1.6rem] border border-[rgba(98,84,63,0.18)] bg-[linear-gradient(180deg,rgba(244,238,228,0.96),rgba(231,223,209,0.94))]">
      <div
        aria-hidden
        className="absolute inset-[5%] rounded-[1.4rem] border border-dashed border-[rgba(101,85,64,0.18)]"
      />
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {atlasLinks.map((link) => {
          const from = atlasNodes.find((node) => node.id === link.from);
          const to = atlasNodes.find((node) => node.id === link.to);

          if (!from || !to) {
            return null;
          }

          return (
            <g key={`${link.from}-${link.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgba(99, 84, 63, 0.42)"
                strokeWidth="0.38"
                strokeDasharray="1.2 1"
              />
              <text
                x={`${(Number.parseFloat(from.x) + Number.parseFloat(to.x)) / 2}%`}
                y={`${(Number.parseFloat(from.y) + Number.parseFloat(to.y)) / 2}%`}
                fill="rgba(92, 78, 60, 0.72)"
                fontSize="2.2"
                letterSpacing="0.4"
                textAnchor="middle"
              >
                {link.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0">
        {atlasNodes.map((node) => (
          <div
            key={node.id}
            className="absolute w-[138px] -translate-x-1/2 -translate-y-1/2 sm:w-[160px]"
            style={{ left: node.x, top: node.y }}
          >
            <div
              className={`rounded-[1.35rem] border px-3 py-3 shadow-[0_18px_40px_-24px_rgba(58,45,29,0.55)] backdrop-blur-sm ${toneClass[node.tone]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                    {node.role}
                  </p>
                  <h3 className="mt-1 text-lg tracking-[-0.05em] text-stone-900">
                    {node.label}
                  </h3>
                </div>
                <div className="mt-1 h-3 w-3 rounded-full border border-[rgba(82,68,51,0.18)] bg-[rgba(248,244,237,0.8)]" />
              </div>
              <p className="mt-3 text-xs leading-5 text-stone-700">{node.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-[1.4rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(249,245,238,0.82)] p-3 text-xs text-stone-600 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="uppercase tracking-[0.24em] text-stone-500">
          Drafting overlay active
        </p>
        <p className="max-w-lg leading-5">
          Final reveal can fade the field mask and brighten confirmed paths while
          preserving the same archival frame.
        </p>
      </div>
    </div>
  );
}

function SideNotation(props: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-[1.7rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(255,251,244,0.78)] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-stone-500">
        {props.index}
      </p>
      <h3 className="mt-3 text-xl tracking-[-0.05em] text-stone-900">
        {props.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{props.body}</p>
    </article>
  );
}

function SignalPanel() {
  return (
    <section className="rounded-[2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(247,242,233,0.88)] p-4 shadow-[0_24px_60px_-36px_rgba(73,58,37,0.45)] md:p-5">
      <div className="border-b border-[rgba(98,84,63,0.16)] pb-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
          Legend
        </p>
        <h2 className="mt-2 text-2xl tracking-[-0.05em] text-stone-900">
          Field signals
        </h2>
      </div>
      <div className="mt-4 grid gap-3">
        <LegendRow swatch="bg-[rgba(181,140,96,0.45)]" label="Origin stamp" />
        <LegendRow swatch="bg-[rgba(140,152,121,0.45)]" label="Witness mark" />
        <LegendRow swatch="bg-[rgba(154,118,96,0.45)]" label="Closure seal" />
        <LegendRow swatch="bg-[rgba(158,149,135,0.42)]" label="Transit edge" />
      </div>
      <div className="mt-5 rounded-[1.5rem] border border-dashed border-[rgba(98,84,63,0.22)] px-4 py-3 text-sm leading-6 text-stone-600">
        Diagram density is carried by notations, bearings, and evidence labels
        instead of stacked feature cards.
      </div>
    </section>
  );
}

function LegendRow(props: { swatch: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-[rgba(98,84,63,0.14)] bg-[rgba(252,248,241,0.82)] px-3 py-3">
      <div className="flex items-center gap-3">
        <span className={`h-3 w-8 rounded-full ${props.swatch}`} />
        <span className="text-sm text-stone-700">{props.label}</span>
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
        mapped
      </span>
    </div>
  );
}

function ArchiveDrawers() {
  return (
    <section className="rounded-[2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(244,238,227,0.92)] p-4 shadow-[0_24px_60px_-36px_rgba(73,58,37,0.45)] md:p-5">
      <div className="flex items-end justify-between gap-4 border-b border-[rgba(98,84,63,0.16)] pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
            Archive drawers
          </p>
          <h2 className="mt-2 text-2xl tracking-[-0.05em] text-stone-900">
            Rule fragments
          </h2>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
          03 slips
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {archiveCards.map((card) => (
          <article
            key={card.shelf}
            className="rounded-[1.5rem] border border-[rgba(98,84,63,0.15)] bg-[rgba(255,252,247,0.76)] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                {card.shelf}
              </p>
              <span className="h-px flex-1 bg-[rgba(98,84,63,0.18)]" />
            </div>
            <h3 className="mt-3 text-lg tracking-[-0.05em] text-stone-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function FieldJournal() {
  return (
    <section className="rounded-[2.2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(250,246,238,0.9)] p-4 shadow-[0_24px_70px_-38px_rgba(73,58,37,0.45)] md:p-6">
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Field journal
            </p>
            <h2 className="mt-2 text-2xl tracking-[-0.05em] text-stone-900 sm:text-3xl">
              Notes pinned beside the map, not beneath it
            </h2>
          </div>
          <p className="text-sm leading-7 text-stone-600">
            The supporting UI can read like clipped ledger notes and route
            commentary. That keeps the experience grounded in the same archival
            system instead of switching to a generic product dashboard underneath
            the hero.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <JournalSlip
            code="Slip 7"
            title="Partial reveal mask"
            body="A vellum overlay can hide unresolved nodes while leaving bearings and annotations visible."
          />
          <JournalSlip
            code="Slip 9"
            title="Route-first mobile view"
            body="On smaller screens the atlas collapses into stacked sheets, preserving order without shrinking the diagram into noise."
          />
        </div>
      </div>
    </section>
  );
}

function JournalSlip(props: {
  code: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rotate-[-0.6deg] rounded-[1.5rem] border border-[rgba(98,84,63,0.16)] bg-[rgba(255,252,247,0.82)] p-4 shadow-[0_18px_40px_-28px_rgba(73,58,37,0.55)] even:rotate-[0.6deg]">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">
        {props.code}
      </p>
      <h3 className="mt-3 text-xl tracking-[-0.05em] text-stone-900">
        {props.title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-600">{props.body}</p>
    </article>
  );
}

function LedgerPanel() {
  return (
    <section className="rounded-[2.2rem] border border-[rgba(98,84,63,0.18)] bg-[rgba(244,238,227,0.92)] p-4 shadow-[0_24px_70px_-38px_rgba(73,58,37,0.45)] md:p-6">
      <div className="flex flex-col gap-4 border-b border-[rgba(98,84,63,0.16)] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
            Route ledger
          </p>
          <h2 className="mt-2 text-2xl tracking-[-0.05em] text-stone-900 sm:text-3xl">
            Recorded handoffs
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-stone-600">
          Times, sectors, and status words can stay lightweight and diagram
          adjacent rather than turning into dense app chrome.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[1.7rem] border border-[rgba(98,84,63,0.16)]">
        <div className="hidden grid-cols-[1.1fr_1.3fr_0.8fr_0.5fr] gap-3 bg-[rgba(255,251,244,0.82)] px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-stone-500 sm:grid">
          <span>Sector</span>
          <span>Signal</span>
          <span>Status</span>
          <span>Time</span>
        </div>
        {ledgerEntries.map((entry) => (
          <div
            key={`${entry.sector}-${entry.time}`}
            className="grid gap-3 border-t border-[rgba(98,84,63,0.12)] bg-[rgba(248,244,236,0.82)] px-4 py-4 text-sm text-stone-700 sm:grid-cols-[1.1fr_1.3fr_0.8fr_0.5fr]"
          >
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:hidden">
                Sector
              </p>
              <span>{entry.sector}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:hidden">
                Signal
              </p>
              <span className="text-stone-600">{entry.signal}</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:hidden">
                Status
              </p>
              <span className="inline-flex rounded-full border border-[rgba(98,84,63,0.16)] px-3 py-1 text-xs uppercase tracking-[0.18em] text-stone-600">
                {entry.status}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:hidden">
                Time
              </p>
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
                {entry.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
