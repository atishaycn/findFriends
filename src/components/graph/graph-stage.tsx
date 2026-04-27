"use client";

import { motion } from "framer-motion";
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

export function GraphStage({
  graph,
}: {
  graph: FinalGraphData;
}) {
  const nodes = buildNodeLayout(graph);
  const nodeIndex = new Map(nodes.map((node) => [node.id, node]));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      <div className="paper-panel overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
          <div className="status-pill">
            <span className="status-dot warning-dot" />
            Finished graph
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(224,107,76,0.72)]" />
              Starter
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-8 rounded-full bg-[rgba(224,107,76,0.72)]" />
              Closing link
            </span>
          </div>
        </div>
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-[68vh] min-h-[520px] w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(246,240,231,0.86))]"
          fill="none"
          role="img"
          aria-label="Finished friend graph"
        >
          <defs>
            <pattern id="graph-grid" width="74" height="74" patternUnits="userSpaceOnUse">
              <path d="M 74 0 L 0 0 0 74" stroke="rgba(34,27,20,0.06)" strokeWidth="1" />
            </pattern>
            <linearGradient id="graph-close" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%" stopColor="#e06b4c" />
              <stop offset="100%" stopColor="#d9883c" />
            </linearGradient>
            <filter id="node-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(79,59,33,0.18)" />
            </filter>
          </defs>

          <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#graph-grid)" />

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
                  stroke={edge.isCompletion ? "url(#graph-close)" : "rgba(34,27,20,0.22)"}
                  strokeWidth={edge.isCompletion ? 5 : 3}
                  strokeDasharray={edge.isCompletion ? undefined : "10 12"}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          <g>
            {nodes.map((node) => (
              <g key={node.id} transform={`translate(${node.x} ${node.y})`} filter="url(#node-shadow)">
                <circle
                  r={NODE_RADIUS}
                  fill={node.isStarter ? "rgba(224,107,76,0.16)" : "rgba(255,255,255,0.95)"}
                  stroke={node.isStarter ? "rgba(224,107,76,0.82)" : "rgba(34,27,20,0.12)"}
                  strokeWidth="2.5"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-sans)"
                  fontSize="16"
                  fontWeight="700"
                  fill="#221b14"
                >
                  {getInitials(node.label)}
                </text>
                <text
                  y="62"
                  textAnchor="middle"
                  fontFamily="var(--font-sans)"
                  fontSize="15"
                  fontWeight="500"
                  fill="rgba(34,27,20,0.76)"
                >
                  {node.label}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </motion.section>
  );
}
