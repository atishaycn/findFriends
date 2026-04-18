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

  const root =
    graph.nodes.find((node) => node.isStarter) ??
    graph.nodes.find((node) => node.parentId === null) ??
    graph.nodes[0];

  const childrenByParent = new Map<string | null, FinalGraphData["nodes"]>();

  for (const node of graph.nodes) {
    const siblings = childrenByParent.get(node.parentId) ?? [];
    siblings.push(node);
    childrenByParent.set(node.parentId, siblings);
  }

  const depthById = new Map<string, number>();
  const leafSpanById = new Map<string, number>();
  const positioned = new Map<string, PositionedNode>();
  const visited = new Set<string>();

  function measure(nodeId: string, depth: number): number {
    if (visited.has(nodeId)) {
      return leafSpanById.get(nodeId) ?? 1;
    }

    visited.add(nodeId);
    depthById.set(nodeId, depth);

    const children = (childrenByParent.get(nodeId) ?? []).filter(
      (child) => child.id !== nodeId,
    );

    if (children.length === 0) {
      leafSpanById.set(nodeId, 1);
      return 1;
    }

    const span = children.reduce((sum, child) => sum + measure(child.id, depth + 1), 0);
    leafSpanById.set(nodeId, Math.max(span, 1));
    return Math.max(span, 1);
  }

  const totalSpan = measure(root.id, 0);
  const maxDepth = Math.max(...depthById.values(), 0);
  const horizontalPadding = 124;
  const verticalTop = 88;
  const verticalBottom = SVG_HEIGHT - 92;
  const usableWidth = SVG_WIDTH - horizontalPadding * 2;
  const usableHeight = verticalBottom - verticalTop;

  function assign(nodeId: string, startSpan: number, endSpan: number) {
    const node = graph.nodes.find((entry) => entry.id === nodeId);

    if (!node) {
      return;
    }

    const depth = depthById.get(nodeId) ?? 0;
    const midpoint = (startSpan + endSpan) / 2;
    const x =
      horizontalPadding +
      (totalSpan <= 1 ? 0.5 : midpoint / totalSpan) * usableWidth;
    const y =
      verticalTop + (maxDepth === 0 ? 0 : (depth / maxDepth) * usableHeight);

    positioned.set(nodeId, {
      ...node,
      x,
      y,
    });

    const children = childrenByParent.get(nodeId) ?? [];
    let cursor = startSpan;

    for (const child of children) {
      const childSpan = leafSpanById.get(child.id) ?? 1;
      assign(child.id, cursor, cursor + childSpan);
      cursor += childSpan;
    }
  }

  assign(root.id, 0, totalSpan);

  const orphans = graph.nodes.filter((node) => !positioned.has(node.id));

  if (orphans.length > 0) {
    const step = usableWidth / (orphans.length + 1);

    orphans.forEach((node, index) => {
      positioned.set(node.id, {
        ...node,
        x: horizontalPadding + step * (index + 1),
        y: verticalBottom,
      });
    });
  }

  return graph.nodes.map((node) => positioned.get(node.id) ?? {
    ...node,
    ...polarToCartesian(-Math.PI / 2, 220),
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
    const controlOffset = Math.min(Math.max(Math.abs(dy) * 0.22, 28), 72);

    return `M ${startX} ${startY} C ${startX} ${startY + controlOffset} ${endX} ${endY - controlOffset} ${endX} ${endY}`;
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

function getNodeTone(
  node: FinalGraphData["nodes"][number],
  completionSourceId: string | null,
  completionTargetId: string | null,
) {
  if (node.id === completionSourceId) {
    return {
      fill: "rgba(255, 153, 92, 0.18)",
      stroke: "rgba(255, 153, 92, 0.94)",
      text: "#fff7ed",
      ring: "rgba(255, 153, 92, 0.28)",
    };
  }

  if (node.id === completionTargetId) {
    return {
      fill: "rgba(255, 237, 213, 0.96)",
      stroke: "rgba(255, 208, 169, 0.8)",
      text: "#1f2937",
      ring: "rgba(255, 208, 169, 0.22)",
    };
  }

  return {
    fill: node.isStarter ? "rgba(251, 146, 60, 0.16)" : "rgba(255,255,255,0.94)",
    stroke: node.isStarter ? "rgba(251,146,60,0.86)" : "rgba(226,232,240,0.32)",
    text: node.isStarter ? "#fff7ed" : "#111827",
    ring: node.isStarter ? "rgba(251,146,60,0.16)" : "rgba(148,163,184,0.08)",
  };
}

export function FriendGraphCanvas({
  graph,
}: {
  graph: FinalGraphData;
}) {
  const nodes = buildNodeLayout(graph);
  const nodeIndex = new Map(nodes.map((node) => [node.id, node]));
  const completionEdge = graph.edges.find((edge) => edge.isCompletion) ?? null;
  const completionSource = completionEdge
    ? graph.nodes.find((node) => node.id === completionEdge.sourceId) ?? null
    : null;
  const completionTarget = completionEdge
    ? graph.nodes.find((node) => node.id === completionEdge.targetId) ?? null
    : null;
  const highlightedNames =
    completionSource && completionTarget
      ? `${completionSource.label} tagged ${completionTarget.label}`
      : "The round snapped shut";
  const maxDepth = Math.max(...nodes.map((node) => {
    let depth = 0;
    let currentParentId = node.parentId;

    while (currentParentId) {
      const parent = graph.nodes.find((entry) => entry.id === currentParentId);
      if (!parent) {
        break;
      }

      depth += 1;
      currentParentId = parent.parentId;
    }

    return depth;
  }), 0);
  const levelGuides = Array.from({ length: maxDepth + 1 }, (_, index) => {
    const top = 88;
    const bottom = SVG_HEIGHT - 92;
    const y = top + (maxDepth === 0 ? 0 : (index / maxDepth) * (bottom - top));
    return {
      label: index === 0 ? "start" : `pass ${index}`,
      y,
    };
  });

  return (
    <section className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(180deg,rgba(8,13,28,0.96),rgba(10,16,32,0.92))] shadow-[0_42px_140px_rgba(2,6,23,0.5)]">
      <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(255,153,92,0.2),transparent_68%)]" />
      <div className="absolute inset-y-0 right-0 w-[34%] bg-[radial-gradient(circle_at_top_right,rgba(255,190,140,0.12),transparent_58%)]" />

      <div className="relative grid gap-6 border-b border-white/8 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.95fr)] lg:px-8 lg:py-7">
        <div className="space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300 backdrop-blur">
            Closing tag
          </div>

          <div className="space-y-3">
            <p className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              {highlightedNames}.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              The last move is called out first so nobody has to decode the diagram.
              The warm route shows the final handoff, and the rest of the graph stays
              muted as supporting context.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Sent by
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ff995c]/40 bg-[#ff995c]/16 text-sm font-semibold tracking-[0.08em] text-orange-50">
                  {getInitials(completionSource?.label ?? "NA")}
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-white">
                    {completionSource?.label ?? "Unknown"}
                  </p>
                  <p className="text-sm text-slate-400">Final sender</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-full border border-[#ff995c]/30 bg-[#ff995c]/12 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#ffd8bf]">
                final pass
              </div>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Landed on
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ffd0a9]/40 bg-[#fff2e5] text-sm font-semibold tracking-[0.08em] text-slate-900">
                  {getInitials(completionTarget?.label ?? "NA")}
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-[-0.03em] text-white">
                    {completionTarget?.label ?? "Unknown"}
                  </p>
                  <p className="text-sm text-slate-400">Friend already in the loop</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="grid gap-3 self-start">
          <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Round shape
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                  {graph.nodes.length}
                </p>
                <p className="mt-1 text-sm text-slate-400">claimed friends</p>
              </div>
              <div>
                <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                  {graph.edges.length}
                </p>
                <p className="mt-1 text-sm text-slate-400">visible links</p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Cast
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {graph.nodes.map((node) => {
                const isSender = node.id === completionSource?.id;
                const isReceiver = node.id === completionTarget?.id;

                return (
                  <div
                    key={node.id}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm",
                      isSender
                        ? "border-[#ff995c]/35 bg-[#ff995c]/12 text-[#ffe7d6]"
                        : isReceiver
                          ? "border-[#ffd0a9]/30 bg-[#fff2e5]/10 text-[#fff1e6]"
                          : "border-white/10 bg-white/[0.04] text-slate-300",
                    ].join(" ")}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold uppercase tracking-[0.08em]">
                      {getInitials(node.label)}
                    </span>
                    <span>{node.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      <div className="relative px-3 pb-3 pt-4 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5">
        <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(14,21,43,0.9),rgba(10,16,32,0.92))]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Round spread
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Each line is a tag handoff. The warm return shows the tag that closed the loop.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff995c]" />
                closing tag
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
                <span className="h-[2px] w-5 rounded-full bg-slate-400" />
                tag path
              </span>
            </div>
          </div>

          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="h-[68vh] min-h-[440px] w-full md:min-h-[540px]"
            fill="none"
            role="img"
            aria-label="Completed loop graph"
          >
            <defs>
              <pattern id="loop-dots" width="240" height="240" patternUnits="userSpaceOnUse">
                <circle cx="16" cy="16" r="2" fill="rgba(148,163,184,0.18)" />
                <circle cx="128" cy="66" r="1.5" fill="rgba(148,163,184,0.14)" />
                <circle cx="208" cy="156" r="1.5" fill="rgba(148,163,184,0.12)" />
              </pattern>
              <linearGradient id="closing-stroke" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#ffb170" />
                <stop offset="100%" stopColor="#ff8a4c" />
              </linearGradient>
              <filter id="node-shadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="rgba(15,23,42,0.45)" />
              </filter>
              <marker
                id="closing-arrow"
                markerWidth="12"
                markerHeight="12"
                refX="9"
                refY="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 12 6 L 0 12 z" fill="#ff9d62" />
              </marker>
              <marker
                id="tree-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(148,163,184,0.72)" />
              </marker>
            </defs>

            <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#loop-dots)" />
            <rect
              x="0"
              y="0"
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              fill="rgba(12,18,38,0.36)"
            />

            <g>
              {levelGuides.map((guide) => (
                <g key={guide.label}>
                  <line
                    x1="36"
                    y1={guide.y}
                    x2={SVG_WIDTH - 36}
                    y2={guide.y}
                    stroke="rgba(148,163,184,0.08)"
                    strokeWidth="1"
                  />
                  <text
                    x="40"
                    y={guide.y - 10}
                    fontFamily="var(--font-sans)"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="0.18em"
                    fill="rgba(148,163,184,0.46)"
                  >
                    {guide.label.toUpperCase()}
                  </text>
                </g>
              ))}
            </g>

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
                    stroke={edge.isCompletion ? "url(#closing-stroke)" : "rgba(148,163,184,0.66)"}
                    strokeWidth={edge.isCompletion ? 5 : 2.5}
                    strokeDasharray={edge.isCompletion ? undefined : undefined}
                    strokeLinecap="round"
                    markerEnd={edge.isCompletion ? "url(#closing-arrow)" : "url(#tree-arrow)"}
                    className={edge.isCompletion ? "graph-edge--completion" : undefined}
                  />
                );
              })}
            </g>

            <g>
              {nodes.map((node) => {
                const tone = getNodeTone(
                  node,
                  completionSource?.id ?? null,
                  completionTarget?.id ?? null,
                );

                return (
                  <g key={node.id} transform={`translate(${node.x} ${node.y})`} filter="url(#node-shadow)">
                    <circle r={NODE_RADIUS + 10} fill={tone.ring} />
                    <circle
                      r={NODE_RADIUS}
                      fill={tone.fill}
                      stroke={tone.stroke}
                      strokeWidth="2.5"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-sans)"
                      fontSize="16"
                      fontWeight="700"
                      fill={tone.text}
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
                    {node.id === completionSource?.id ? (
                      <text
                        y="-54"
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.18em"
                        fill="#ffd8bf"
                      >
                        FINAL SENDER
                      </text>
                    ) : null}
                    {node.id === completionTarget?.id ? (
                      <text
                        y="-54"
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.18em"
                        fill="#ffe9d9"
                      >
                        LOOP TARGET
                      </text>
                    ) : null}
                    {node.isStarter && node.id !== completionTarget?.id ? (
                      <text
                        y="-54"
                        textAnchor="middle"
                        fontFamily="var(--font-sans)"
                        fontSize="11"
                        fontWeight="700"
                        letterSpacing="0.18em"
                        fill="rgba(226,232,240,0.82)"
                      >
                        STARTER
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
