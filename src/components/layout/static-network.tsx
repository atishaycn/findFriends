export function StaticNetwork({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="sketch-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="22" stdDeviation="18" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#sketch-shadow)" strokeLinecap="round">
        <path
          d="M66 236C90 164 166 108 244 108C320 108 370 150 400 212"
          stroke="rgba(255, 255, 255, 0.54)"
          strokeWidth="3"
          strokeDasharray="7 10"
        />
        <path
          d="M242 106C252 172 230 224 182 274"
          stroke="rgba(255, 255, 255, 0.62)"
          strokeWidth="3"
        />
        <path
          d="M242 106C296 124 330 176 334 236"
          stroke="rgba(255, 255, 255, 0.62)"
          strokeWidth="3"
        />
        <path
          d="M182 276C240 322 304 318 356 274"
          stroke="rgba(255, 141, 93, 0.92)"
          strokeWidth="4"
          strokeDasharray="10 11"
        />
      </g>
      {[
        { x: 62, y: 238, label: "A", accent: false },
        { x: 240, y: 98, label: "B", accent: false },
        { x: 178, y: 284, label: "C", accent: false },
        { x: 336, y: 248, label: "D", accent: true },
        { x: 402, y: 226, label: "E", accent: false },
      ].map((node) => (
        <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
          <circle
            r="31"
            fill={
              node.accent ? "rgba(255,209,102,0.18)" : "rgba(16, 25, 53, 0.88)"
            }
            stroke={
              node.accent ? "rgba(255,141,93,0.95)" : "rgba(255,255,255,0.82)"
            }
            strokeWidth="3"
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="24"
            fontFamily="var(--font-display)"
            fill="rgba(244,240,232,0.96)"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
