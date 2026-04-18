import type { FinalGraphData } from "@/lib/types";

type PositionedNode = FinalGraphData["nodes"][number] & {
  x: number;
  y: number;
};

const SVG_WIDTH = 1120;
const SVG_HEIGHT = 720;
const CENTER_X = SVG_WIDTH / 2;
const CENTER_Y = SVG_HEIGHT / 2 + 18;
const NODE_RADIUS = 34;

function polarToCartesian(angle: number, radius: number) {
  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius,
  };
}

function buildNodeLayout(graph: FinalGraphData) {
  if (graph.nodes.length === 1) {
    return [
      {
        ...graph.nodes[0],
        x: CENTER_X,
        y: CENTER_Y,
      },
    ] satisfies PositionedNode[];
  }

  if (graph.nodes.length === 2) {
    return graph.nodes.map((node, index) => ({
      ...node,
      x: CENTER_X + (index === 0 ? -160 : 160),
      y: CENTER_Y,
    })) satisfies PositionedNode[];
  }

  const radius = Math.min(250 + graph.nodes.length * 12, 300);

  return graph.nodes.map((node, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / graph.nodes.length;
    return {
      ...node,
      ...polarToCartesian(angle, radius),
    };
  }) satisfies PositionedNode[];
}

function buildEdgePath(
  source: PositionedNode,
  target: PositionedNode,
  isCompletion: boolean,
) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const distance = Math.hypot(dx, dy) || 1;
  const nx = dx / distance;
  const ny = dy / distance;
  const startX = source.x + nx * NODE_RADIUS;
  const startY = source.y + ny * NODE_RADIUS;
  const endX = target.x - nx * NODE_RADIUS;
  const endY = target.y - ny * NODE_RADIUS;

  if (!isCompletion) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const bend = Math.min(Math.max(distance * 0.22, 42), 96);
  const controlX = midX - ny * bend;
  const controlY = midY + nx * bend;

  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

function getInitials(label: string) {
  const parts = label.trim().split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }

  return label.slice(0, 2).toUpperCase();
}

export function FriendGraphCanvas({
  graph,
}: {
  graph: FinalGraphData;
}) {
  const nodes = buildNodeLayout(graph);
  const nodeIndex = new Map(nodes.map((node) => [node.id, node]));

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.94),rgba(15,23,42,0.88))] shadow-[0_36px_120px_rgba(15,23,42,0.42)]">
      <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.2),transparent_65%)]" />
      <div className="absolute left-4 top-4 z-10 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 backdrop-blur">
        Closed loop
      </div>
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="h-[72vh] min-h-[540px] w-full"
        fill="none"
        role="img"
        aria-label="Completed loop graph"
      >
        <defs>
          <pattern id="loop-grid" width="74" height="74" patternUnits="userSpaceOnUse">
            <path d="M 74 0 L 0 0 0 74" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          </pattern>
          <pattern id="loop-dots" width="240" height="240" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="2" fill="rgba(148,163,184,0.18)" />
            <circle cx="128" cy="66" r="1.5" fill="rgba(148,163,184,0.14)" />
            <circle cx="208" cy="156" r="1.5" fill="rgba(148,163,184,0.12)" />
          </pattern>
          <linearGradient id="closing-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fb7185" />
          </linearGradient>
          <filter id="node-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="rgba(15,23,42,0.45)" />
          </filter>
        </defs>

        <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#loop-grid)" />
        <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#loop-dots)" />

        <g>
          {graph.edges.map((edge) => {
            const source = nodeIndex.get(edge.sourceId);
            const target = nodeIndex.get(edge.targetId);

            if (!source || !target) {
              return null;
            }

            return (
              <path
                key={edge.id}
                d={buildEdgePath(source, target, edge.isCompletion)}
                stroke={edge.isCompletion ? "url(#closing-stroke)" : "rgba(148,163,184,0.62)"}
                strokeWidth={edge.isCompletion ? 5 : 3}
                strokeDasharray={edge.isCompletion ? undefined : "10 12"}
                strokeLinecap="round"
                className={edge.isCompletion ? "closing-edge" : undefined}
              />
            );
          })}
        </g>

        <g>
          {nodes.map((node) => (
            <g key={node.id} transform={`translate(${node.x} ${node.y})`} filter="url(#node-shadow)">
              <circle
                r={NODE_RADIUS}
                fill={node.isStarter ? "rgba(249,115,22,0.18)" : "rgba(255,255,255,0.96)"}
                stroke={node.isStarter ? "rgba(251,146,60,0.95)" : "rgba(226,232,240,0.32)"}
                strokeWidth="2.5"
              />
              <text
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-sans)"
                fontSize="16"
                fontWeight="700"
                fill={node.isStarter ? "#fef2f2" : "#111827"}
              >
                {getInitials(node.label)}
              </text>
              <text
                y="62"
                textAnchor="middle"
                fontFamily="var(--font-sans)"
                fontSize="15"
                fontWeight="500"
                fill="rgba(226,232,240,0.9)"
              >
                {node.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}
