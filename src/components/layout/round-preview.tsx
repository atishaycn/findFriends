"use client";

import { motion } from "framer-motion";

const nodes = [
  { x: 110, y: 112, label: "Lena", starter: true, delay: 0 },
  { x: 246, y: 158, label: "Ciro", delay: 0.2 },
  { x: 402, y: 118, label: "Inez", delay: 0.35 },
  { x: 324, y: 312, label: "Mara", delay: 0.5 },
];

const activity = [
  "Mara claimed the latest link",
  "A fresh link is ready to share",
  "The loop is still unresolved",
];

export function RoundPreview({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2.45rem] border border-[rgba(34,29,23,0.08)] bg-[linear-gradient(155deg,rgba(255,254,250,0.96),rgba(241,233,220,0.92))] p-6 shadow-[0_36px_70px_-42px_rgba(79,59,33,0.4)] sm:p-8 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(195,92,66,0.18),transparent_62%)]" />
      <div className="absolute right-5 top-5">
        <div className="capsule bg-white/78">
          <span className="dot-pulse" />
          Chain preview
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
        <div className="space-y-4">
          <p className="eyebrow">What the round feels like</p>
          <h3 className="text-[2rem] font-semibold tracking-tight text-ink sm:text-[2.55rem]">
            A chain that stays incomplete until the closing return makes it legible.
          </h3>
          <p className="max-w-md text-sm leading-7 text-muted">
            The interface keeps showing only the next local action while the
            network is still forming behind the scenes.
          </p>

          <div className="space-y-2 pt-2">
            {activity.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
                className="rounded-[1.4rem] border border-line bg-white/70 px-4 py-3 text-sm text-muted"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[28rem] overflow-hidden rounded-[2rem] border border-[rgba(34,29,23,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(245,238,228,0.92))] p-6 sm:p-7">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute left-[11%] top-[14%] w-36 rounded-[1.7rem] border border-[rgba(34,29,23,0.08)] bg-white/82 px-4 py-3 shadow-[0_18px_32px_-24px_rgba(79,59,33,0.35)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Start
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">Open the round and send the first link.</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 6.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.35 }}
            className="absolute right-[10%] top-[26%] w-44 rounded-[1.7rem] border border-[rgba(34,29,23,0.08)] bg-[rgba(195,92,66,0.08)] px-4 py-3 shadow-[0_18px_32px_-24px_rgba(79,59,33,0.3)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Pass
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">One new link travels to one next friend.</p>
          </motion.div>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.7 }}
            className="absolute bottom-[16%] left-[18%] w-48 rounded-[1.7rem] border border-[rgba(34,29,23,0.08)] bg-white/82 px-4 py-3 shadow-[0_18px_32px_-24px_rgba(79,59,33,0.3)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Reveal
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">The graph opens only after the valid return.</p>
          </motion.div>

          <svg
            viewBox="0 0 620 420"
            className="absolute inset-0 h-full w-full"
            fill="none"
            role="img"
            aria-label="Friend chain preview"
          >
            <defs>
              <linearGradient id="preview-loop" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#c35c42" />
                <stop offset="100%" stopColor="#b57d35" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 110 112 L 246 158 L 402 118"
              stroke="rgba(27,23,19,0.18)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="10 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            <motion.path
              d="M 402 118 Q 492 190 324 312"
              stroke="url(#preview-loop)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 1] }}
              transition={{ duration: 2.8, times: [0, 0.72, 1], repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.2 }}
            />
          </svg>

          {nodes.map((node) => (
            <motion.div
              key={node.label}
              className="absolute"
              style={{ left: `${(node.x / 620) * 100}%`, top: `${(node.y / 420) * 100}%` }}
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: node.delay }}
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  boxShadow: node.starter
                    ? [
                        "0 12px 26px -18px rgba(195,92,66,0.45)",
                        "0 20px 32px -16px rgba(195,92,66,0.34)",
                        "0 12px 26px -18px rgba(195,92,66,0.45)",
                      ]
                    : [
                        "0 10px 22px -18px rgba(72,56,36,0.24)",
                        "0 18px 28px -16px rgba(72,56,36,0.18)",
                        "0 10px 22px -18px rgba(72,56,36,0.24)",
                      ],
                }}
                transition={{
                  duration: 4.8,
                  delay: node.delay,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className={`flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-sm font-semibold ${
                  node.starter
                    ? "border-[rgba(195,92,66,0.75)] bg-[rgba(195,92,66,0.14)] text-ink"
                    : "border-[rgba(27,23,19,0.12)] bg-white/96 text-ink"
                }`}
              >
                {node.label.slice(0, 2).toUpperCase()}
              </motion.div>
              <p className="mt-5 -translate-x-1/2 text-center text-[13px] font-semibold text-[rgba(27,23,19,0.72)]">
                {node.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
