import type { CSSProperties, ReactNode } from "react";

import { SignalNetworkBoard } from "./signal-network-board";

const roundMetrics = [
  { label: "Nodes confirmed", value: "07", detail: "Two branches can still hand off." },
  { label: "Loop readiness", value: "81%", detail: "Close path is armed and stable." },
  { label: "Return warnings", value: "01", detail: "Direct send-back stays blocked." },
];

const activityFeed = [
  { time: "12:04", title: "Lane accepted relay", body: "New branch anchored off Jules and marked eligible for closure." },
  { time: "11:58", title: "Maya flagged a near-return", body: "System kept the graph open and issued a warning instead of counting it." },
  { time: "11:46", title: "Jules handed off to Niko", body: "Transit score rose because the path opened a second valid branch." },
  { time: "11:32", title: "Round switched to signal view", body: "Network board now favors route pressure, not social profile chrome." },
];

const protocolRules = [
  "One person starts the round and seeds the first relay.",
  "Each accepted invite becomes a node and keeps the graph hidden.",
  "Direct returns are warnings, not a valid closing loop.",
  "The graph unlocks only after a clean closing edge lands.",
];

const activeNodes = [
  { name: "Origin", state: "source", status: "stable" },
  { name: "Ivy", state: "relay", status: "clear" },
  { name: "Jules", state: "relay", status: "armed" },
  { name: "Close", state: "target", status: "waiting" },
];

const theme = {
  ["--signal-bg" as string]: "#f3eee6",
  ["--signal-surface" as string]: "#fffaf4",
  ["--signal-ink" as string]: "#171411",
  ["--signal-muted" as string]: "#8f8378",
  ["--signal-accent" as string]: "#f97316",
  ["--signal-line" as string]: "rgba(23, 20, 17, 0.12)",
} satisfies CSSProperties;

export function SignalConceptB() {
  return (
    <div
      style={theme}
      className="min-h-[100dvh] bg-[var(--signal-bg)] text-[var(--signal-ink)]"
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(23,20,17,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(23,20,17,0.04)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(23,20,17,0.08),transparent_24%)]" />

        <main className="relative mx-auto flex max-w-[1580px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <header className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
            <section className="overflow-hidden rounded-[1.3rem] border border-[var(--signal-line)] bg-[var(--signal-surface)] shadow-[0_32px_90px_rgba(23,20,17,0.08)]">
              <div className="border-b border-[var(--signal-line)] px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[var(--signal-muted)]">
                      Friend Graph / UI Lab / Concept B
                    </p>
                    <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.08em] text-[var(--signal-ink)] md:text-6xl">
                      A sharp operator view for the round before the reveal.
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--signal-muted)] sm:text-base">
                      This concept drops the soft social framing and treats the graph like a live route system:
                      clear pressure lines, visible protocol, and a closure state that feels earned instead of decorative.
                    </p>
                  </div>

                  <div className="grid min-w-[16rem] gap-2 self-start lg:self-end">
                    <div className="flex items-center justify-between rounded-[0.95rem] border border-[var(--signal-line)] bg-[#171411] px-4 py-3 text-[#fffaf4]">
                      <div>
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f7c7ad]">
                          Live state
                        </p>
                        <p className="mt-1 text-sm font-semibold tracking-[-0.03em]">Closing edge available</p>
                      </div>
                      <div className="rounded-full border border-white/[0.12] bg-white/[0.08] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
                        armed
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <MicroStat label="Mode" value="Signal" />
                      <MicroStat label="Theme" value="Light" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 px-5 py-4 sm:grid-cols-3 sm:px-6">
                {roundMetrics.map((metric) => (
                  <MetricCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    detail={metric.detail}
                  />
                ))}
              </div>
            </section>

            <aside className="grid gap-4">
              <Panel
                eyebrow="Active roster"
                title="Current nodes"
                detail="The most important roles stay visible at the top level."
              >
                <div className="grid gap-2">
                  {activeNodes.map((node) => (
                    <div
                      key={node.name}
                      className="flex items-center justify-between rounded-[0.95rem] border border-[var(--signal-line)] bg-white px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold tracking-[-0.03em] text-[var(--signal-ink)]">
                          {node.name}
                        </p>
                        <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--signal-muted)]">
                          {node.state}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#f97316]/[0.18] bg-[#f97316]/[0.10] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#d85f14]">
                        {node.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>
            </aside>
          </header>

          <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
            <div className="grid gap-4">
              <Panel
                eyebrow="Protocol"
                title="Round rules"
                detail="The key logic sits in plain language instead of hiding in a help modal."
              >
                <div className="grid gap-2">
                  {protocolRules.map((rule, index) => (
                    <div
                      key={rule}
                      className="rounded-[0.95rem] border border-[var(--signal-line)] bg-white px-4 py-3"
                    >
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--signal-muted)]">
                        Rule {index + 1}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--signal-ink)]">{rule}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel
                eyebrow="Signal split"
                title="Route health"
                detail="A compact utilitarian read instead of celebratory graph chrome."
              >
                <div className="grid gap-2">
                  <RouteBar label="Relay stability" value="86%" width="86%" tone="ink" />
                  <RouteBar label="Closure confidence" value="81%" width="81%" tone="accent" />
                  <RouteBar label="Return risk" value="18%" width="18%" tone="muted" />
                </div>
              </Panel>
            </div>

            <div className="grid gap-4">
              <SignalNetworkBoard />

              <Panel
                eyebrow="Relay ledger"
                title="Recent graph activity"
                detail="The feed reads like a control log, not a chat thread."
              >
                <div className="grid gap-3">
                  {activityFeed.map((item) => (
                    <article
                      key={`${item.time}-${item.title}`}
                      className="grid gap-2 rounded-[1rem] border border-[var(--signal-line)] bg-white px-4 py-4 sm:grid-cols-[68px_minmax(0,1fr)]"
                    >
                      <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--signal-muted)]">
                        {item.time}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold tracking-[-0.03em] text-[var(--signal-ink)]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--signal-muted)]">{item.body}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-4">
              <Panel
                eyebrow="Inspector"
                title="Selected branch"
                detail="Detail stays dense, direct, and grounded in route logic."
              >
                <div className="grid gap-3">
                  <InspectorRow label="Source" value="Jules" />
                  <InspectorRow label="Target" value="Lane" />
                  <InspectorRow label="Transit score" value="0.82" />
                  <InspectorRow label="Close eligibility" value="Ready after one more handoff" />
                </div>
              </Panel>

              <section className="overflow-hidden rounded-[1.2rem] border border-[#171411]/[0.14] bg-[#171411] text-[#fffaf4] shadow-[0_24px_70px_rgba(23,20,17,0.18)]">
                <div className="border-b border-white/[0.10] px-5 py-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#f7c7ad]">
                    Operator note
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em]">
                    Friend Graph can feel like infrastructure, not decoration.
                  </h2>
                </div>
                <div className="grid gap-4 px-5 py-5 text-sm leading-6 text-[#f0e3d8]">
                  <p>
                    Concept B is intentionally severe. It treats invites, warnings, and closure as first-class system
                    state so the product looks dependable before the final reveal lands.
                  </p>
                  <div className="grid gap-2">
                    <Flag tone="accent" label="Best fit" value="Powerful in studio and replay surfaces." />
                    <Flag tone="light" label="Tradeoff" value="Less playful, more operational." />
                    <Flag tone="light" label="Distinctive cue" value="Orange flow lines over an ink-on-paper system shell." />
                  </div>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function Panel({
  eyebrow,
  title,
  detail,
  children,
}: {
  eyebrow: string;
  title: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.15rem] border border-[var(--signal-line)] bg-[var(--signal-surface)] shadow-[0_24px_70px_rgba(23,20,17,0.06)]">
      <div className="border-b border-[var(--signal-line)] px-5 py-4">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--signal-muted)]">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-[-0.05em] text-[var(--signal-ink)]">
          {title}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--signal-muted)]">{detail}</p>
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1rem] border border-[var(--signal-line)] bg-white px-4 py-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--signal-muted)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.08em] text-[var(--signal-ink)]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--signal-muted)]">{detail}</p>
    </div>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.95rem] border border-[var(--signal-line)] bg-white px-3 py-3">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-[var(--signal-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold tracking-[-0.04em] text-[var(--signal-ink)]">{value}</p>
    </div>
  );
}

function RouteBar({
  label,
  value,
  width,
  tone,
}: {
  label: string;
  value: string;
  width: string;
  tone: "accent" | "ink" | "muted";
}) {
  const toneClassName =
    tone === "accent"
      ? "bg-[#f97316]"
      : tone === "muted"
        ? "bg-[#c8beb4]"
        : "bg-[#171411]";

  return (
    <div className="rounded-[0.95rem] border border-[var(--signal-line)] bg-white px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold tracking-[-0.03em] text-[var(--signal-ink)]">{label}</p>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--signal-muted)]">
          {value}
        </p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-[#efe7dd]">
        <div className={`h-full rounded-full ${toneClassName}`} style={{ width }} />
      </div>
    </div>
  );
}

function InspectorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[0.95rem] border border-[var(--signal-line)] bg-white px-4 py-3">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[var(--signal-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--signal-ink)]">{value}</p>
    </div>
  );
}

function Flag({
  tone,
  label,
  value,
}: {
  tone: "accent" | "light";
  label: string;
  value: string;
}) {
  return (
    <div
      className={`rounded-[1rem] border px-4 py-3 ${
        tone === "accent"
          ? "border-[#f97316]/[0.20] bg-[#f97316]/[0.10] text-[#fffaf4]"
          : "border-white/[0.10] bg-white/[0.06] text-[#f0e3d8]"
      }`}
    >
      <p
        className={`text-[0.62rem] font-semibold uppercase tracking-[0.22em] ${
          tone === "accent" ? "text-[#ffd6c0]" : "text-[#d8c9bc]"
        }`}
      >
        {label}
      </p>
      <p className="mt-2 text-sm leading-6">{value}</p>
    </div>
  );
}
