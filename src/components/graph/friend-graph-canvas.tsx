"use client";

import { stratify, tree } from "d3";
import type { FinalGraphData } from "@/lib/types";

type PositionedNode = {
  id: string;
  label: string;
  isStarter: boolean;
  x: number;
  y: number;
};

export function FriendGraphCanvas({
  graph,
}: {
  graph: FinalGraphData;
}) {
  const root = stratify<(typeof graph.nodes)[number]>()
    .id((node) => node.id)
    .parentId((node) => node.parentId ?? undefined)(graph.nodes);

  tree<(typeof graph.nodes)[number]>().nodeSize([150, 156])(root);

  const positionedNodes = root.descendants().map<PositionedNode>((node) => ({
    id: node.data.id,
    label: node.data.label,
    isStarter: node.data.isStarter,
    x: node.x ?? 0,
    y: node.y ?? 0,
  }));

  const xValues = positionedNodes.map((node) => node.x);
  const yValues = positionedNodes.map((node) => node.y);
  const paddingX = 140;
  const paddingY = 120;
  const minX = Math.min(...xValues) - paddingX;
  const maxX = Math.max(...xValues) + paddingX;
  const minY = Math.min(...yValues) - paddingY;
  const maxY = Math.max(...yValues) + paddingY;
  const nodeIndex = new Map(positionedNodes.map((node) => [node.id, node]));

  return (
    <div className="graph-surface overflow-hidden rounded-[2rem] border border-black/8 bg-white/72 p-4 shadow-[0_24px_80px_rgba(35,32,29,0.12)] sm:p-6">
      <svg
        viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
        className="h-[420px] w-full sm:h-[560px]"
        fill="none"
      >
        <defs>
          <pattern
            id="canvas-dots"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" fill="rgba(25,27,26,0.1)" />
          </pattern>
          <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodOpacity="0.12" />
          </filter>
        </defs>
        <rect
          x={minX}
          y={minY}
          width={maxX - minX}
          height={maxY - minY}
          fill="url(#canvas-dots)"
        />
        {graph.edges.map((edge, index) => {
          const source = nodeIndex.get(edge.sourceId);
          const target = nodeIndex.get(edge.targetId);

          if (!source || !target) {
            return null;
          }

          const midpointY = source.y + (target.y - source.y) * 0.48;
          const path = `M ${source.x} ${source.y} C ${source.x} ${midpointY} ${target.x} ${midpointY} ${target.x} ${target.y}`;

          return (
            <path
              key={edge.id}
              d={path}
              className={edge.isCompletion ? "graph-edge graph-edge--completion" : "graph-edge"}
              style={{ animationDelay: `${index * 120}ms` }}
            />
          );
        })}
        {positionedNodes.map((node, index) => (
          <g
            key={node.id}
            transform={`translate(${node.x} ${node.y})`}
            style={{ animationDelay: `${index * 90}ms` }}
            className="graph-node"
            filter="url(#node-shadow)"
          >
            <circle
              r="41"
              fill={node.isStarter ? "rgba(231,115,59,0.16)" : "rgba(255,255,255,0.96)"}
              stroke={node.isStarter ? "rgba(231,115,59,0.92)" : "rgba(25,27,26,0.76)"}
              strokeWidth="3"
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-display)"
              fontSize="26"
              fill="rgba(25,27,26,0.92)"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
