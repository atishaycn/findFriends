type SignalNode = {
  id: string;
  label: string;
  role: string;
  x: number;
  y: number;
  tone: "accent" | "ink" | "muted";
};

type SignalEdge = {
  id: string;
  from: string;
  to: string;
  status: "closed" | "active" | "watch";
  curve: number;
};

const nodes: SignalNode[] = [
  { id: "origin", label: "Origin", role: "starter", x: 118, y: 158, tone: "accent" },
  { id: "ivy", label: "Ivy", role: "relay", x: 260, y: 92, tone: "ink" },
  { id: "jules", label: "Jules", role: "relay", x: 420, y: 132, tone: "muted" },
  { id: "maya", label: "Maya", role: "branch", x: 286, y: 260, tone: "ink" },
  { id: "niko", label: "Niko", role: "branch", x: 468, y: 262, tone: "ink" },
  { id: "lane", label: "Lane", role: "branch", x: 618, y: 144, tone: "muted" },
  { id: "close", label: "Close", role: "target", x: 646, y: 302, tone: "accent" },
];

const edges: SignalEdge[] = [
  { id: "e1", from: "origin", to: "ivy", status: "closed", curve: -18 },
  { id: "e2", from: "ivy", to: "jules", status: "closed", curve: -20 },
  { id: "e3", from: "ivy", to: "maya", status: "closed", curve: 24 },
  { id: "e4", from: "jules", to: "lane", status: "active", curve: -12 },
  { id: "e5", from: "maya", to: "niko", status: "watch", curve: 12 },
  { id: "e6", from: "niko", to: "close", status: "active", curve: 16 },
  { id: "e7", from: "lane", to: "close", status: "closed", curve: -28 },
];

const toneFillClassName: Record<SignalNode["tone"], string> = {
  accent: "fill-[#f97316]",
  ink: "fill-[#171411]",
  muted: "fill-[#8f8378]",
};

const edgeStyle: Record<
  SignalEdge["status"],
  { stroke: string; width: number; opacity: number; dash: string }
> = {
  closed: { stroke: "#171411", width: 2.2, opacity: 0.34, dash: "0" },
  active: { stroke: "#f97316", width: 2.8, opacity: 1, dash: "8 10" },
  watch: { stroke: "#171411", width: 2.2, opacity: 0.56, dash: "2 7" },
};

function buildCurve(from: SignalNode, to: SignalNode, curve: number) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const offsetX = (-dy / length) * curve;
  const offsetY = (dx / length) * curve;

  return `M ${from.x} ${from.y} Q ${midX + offsetX} ${midY + offsetY} ${to.x} ${to.y}`;
}

export function SignalNetworkBoard() {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className="overflow-hidden rounded-[1.2rem] border border-[#171411]/[0.14] bg-[#fffaf4] shadow-[0_28px_90px_rgba(23,20,17,0.08)]">
      <div className="flex items-center justify-between border-b border-[#171411]/[0.10] px-5 py-4">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#8f8378]">
            Live Network
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-[#171411]">
            Route Pressure Map
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-[#171411]">
          <span className="inline-flex size-2.5 rounded-full bg-[#f97316]" />
          closure path armed
        </div>
      </div>

      <div className="relative aspect-[1.38/1] overflow-hidden bg-[linear-gradient(180deg,rgba(249,115,22,0.06),rgba(255,250,244,0.95))]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(23,20,17,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(23,20,17,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_82%_76%,rgba(23,20,17,0.1),transparent_24%)]" />

        <div className="absolute left-5 top-5 z-10 grid gap-2 rounded-[0.95rem] border border-[#171411]/[0.10] bg-[#fffaf4]/[0.90] p-3 backdrop-blur">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8f8378]">
            Board Readout
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Readout label="Open relays" value="03" tone="ink" />
            <Readout label="Close risk" value="18%" tone="accent" />
            <Readout label="Warnings" value="01" tone="muted" />
          </div>
        </div>

        <svg
          viewBox="0 0 760 420"
          className="absolute inset-0 h-full w-full"
          aria-label="Friend Graph signal diagram"
          role="img"
        >
          <defs>
            <radialGradient id="signal-glow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          {edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);

            if (!from || !to) {
              return null;
            }

            const style = edgeStyle[edge.status];

            return (
              <g key={edge.id}>
                <path
                  d={buildCurve(from, to, edge.curve)}
                  fill="none"
                  stroke={style.stroke}
                  strokeWidth={style.width}
                  strokeLinecap="round"
                  opacity={style.opacity}
                  strokeDasharray={style.dash}
                  className={edge.status === "active" ? "signal-dash" : undefined}
                />
                {edge.status === "active" ? (
                  <path
                    d={buildCurve(from, to, edge.curve)}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth={0.9}
                    strokeLinecap="round"
                    opacity={0.95}
                    strokeDasharray="2 14"
                    className="signal-dash-fast"
                  />
                ) : null}
              </g>
            );
          })}

          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
              {node.tone === "accent" ? <circle r="42" fill="url(#signal-glow)" /> : null}
              <circle
                r={node.tone === "accent" ? 18 : 15}
                className={toneFillClassName[node.tone]}
                fillOpacity={node.tone === "muted" ? 0.12 : 1}
                stroke={node.tone === "muted" ? "#8f8378" : "#fffaf4"}
                strokeWidth={node.tone === "muted" ? 2.2 : 2.6}
              />
              <circle
                r={node.tone === "accent" ? 6 : 4}
                fill={node.tone === "accent" ? "#fffaf4" : "#fffaf4"}
                opacity={node.tone === "muted" ? 0.8 : 1}
              />
              <text
                x="0"
                y={node.tone === "accent" ? -32 : -27}
                textAnchor="middle"
                className="fill-[#171411] text-[13px] font-semibold tracking-[0.16em]"
              >
                {node.label.toUpperCase()}
              </text>
              <text
                x="0"
                y={node.tone === "accent" ? 39 : 32}
                textAnchor="middle"
                className="fill-[#8f8378] text-[11px] font-medium tracking-[0.2em]"
              >
                {node.role.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        <div className="absolute bottom-5 right-5 z-10 max-w-[16rem] rounded-[0.95rem] border border-[#171411]/[0.12] bg-[#171411] p-4 text-[#fffaf4] shadow-[0_24px_64px_rgba(23,20,17,0.24)]">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#f7c7ad]">
            Selected Route
          </p>
          <div className="mt-3 grid gap-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-[-0.03em]">Niko to Close</p>
                <p className="mt-1 text-xs leading-5 text-[#f0e3d8]">
                  Active closing path with one remaining handoff before graph unlock.
                </p>
              </div>
              <div className="rounded-full border border-white/[0.14] bg-white/[0.08] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#f7c7ad]">
                armed
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[0.72rem] uppercase tracking-[0.18em] text-[#f0e3d8]">
              <div className="rounded-2xl border border-white/[0.10] bg-white/[0.06] px-3 py-2">
                latency 00:42
              </div>
              <div className="rounded-2xl border border-white/[0.10] bg-white/[0.06] px-3 py-2">
                risk low
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes signalFlow {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -180;
          }
        }

        @keyframes signalFlowFast {
          from {
            stroke-dashoffset: 0;
          }
          to {
            stroke-dashoffset: -110;
          }
        }

        .signal-dash {
          animation: signalFlow 14s linear infinite;
        }

        .signal-dash-fast {
          animation: signalFlowFast 8s linear infinite;
        }
      `}</style>
    </section>
  );
}

function Readout({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "accent" | "ink" | "muted";
}) {
  const valueClassName =
    tone === "accent"
      ? "text-[#f97316]"
      : tone === "muted"
        ? "text-[#8f8378]"
        : "text-[#171411]";

  return (
      <div className="rounded-[0.9rem] border border-[#171411]/[0.10] bg-white px-3 py-3">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#8f8378]">
        {label}
      </p>
      <p className={`mt-2 text-lg font-semibold tracking-[-0.06em] ${valueClassName}`}>{value}</p>
    </div>
  );
}
