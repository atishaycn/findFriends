"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle, LinkSimple, Pulse } from "@phosphor-icons/react";
import { pulseEdges, pulseNodes } from "./pulse-content";

type EdgeEndpoint = {
  x: number;
  y: number;
};

function getEdgeEndpoint(nodeId: string): EdgeEndpoint {
  const node = pulseNodes.find((candidate) => candidate.id === nodeId);

  if (!node) {
    throw new Error(`Missing pulse node: ${nodeId}`);
  }

  return { x: node.x, y: node.y };
}

export function PulseGraphBoard() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#14161a] p-4 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,255,87,0.22),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(89,193,255,0.18),transparent_16%),linear-gradient(135deg,rgba(255,107,61,0.18),transparent_42%)]" />
      <div className="absolute inset-[4%] rounded-[2rem] border border-white/8" />
      <div className="absolute left-[-10%] top-[18%] h-36 w-36 rounded-full bg-[#ff6b3d]/24 blur-3xl" />
      <div className="absolute bottom-[6%] right-[2%] h-32 w-32 rounded-full bg-[#59c1ff]/18 blur-3xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/42">
            Graph stage
          </p>
          <h2 className="mt-3 max-w-[12ch] text-3xl font-semibold tracking-[-0.06em] text-[#f5ebd5] sm:text-[2.7rem]">
            The hidden round feels live before it reveals.
          </h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/6 p-3 text-[#d6ff57]">
          <Pulse size={24} weight="bold" />
        </div>
      </div>

      <div className="relative mt-6 aspect-[1.03/1] overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,22,26,0.88),rgba(10,12,15,0.98))]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.8rem_3.8rem] opacity-35" />
        <motion.div
          className="absolute inset-x-[8%] top-[16%] h-px bg-gradient-to-r from-transparent via-[#d6ff57] to-transparent"
          animate={reduceMotion ? undefined : { opacity: [0.25, 0.85, 0.25], scaleX: [0.94, 1, 0.94] }}
          transition={reduceMotion ? undefined : { duration: 3.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-y-[20%] right-[18%] w-px bg-gradient-to-b from-transparent via-[#59c1ff] to-transparent"
          animate={reduceMotion ? undefined : { opacity: [0.2, 0.75, 0.2], scaleY: [0.9, 1, 0.9] }}
          transition={reduceMotion ? undefined : { duration: 4.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
        />

        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {pulseEdges.map(([from, to], index) => {
            const start = getEdgeEndpoint(from);
            const end = getEdgeEndpoint(to);
            const isClosingEdge = from === "south" && to === "close";

            return (
              <motion.path
                key={`${from}-${to}`}
                d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                fill="none"
                stroke={isClosingEdge ? "#d6ff57" : "#f5ebd5"}
                strokeWidth={isClosingEdge ? 1.6 : 1.1}
                strokeLinecap="round"
                strokeDasharray={isClosingEdge ? "1 0" : "2.4 4.5"}
                initial={reduceMotion ? false : { pathLength: 0.25, opacity: 0.22 }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        pathLength: isClosingEdge ? [0.45, 1, 0.6] : [0.3, 1, 0.5],
                        opacity: isClosingEdge ? [0.2, 0.95, 0.45] : [0.2, 0.8, 0.28],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: isClosingEdge ? 2.8 : 4.5,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.18,
                      }
                }
              />
            );
          })}
        </svg>

        {pulseNodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute"
            style={{
              left: `calc(${node.x}% - 2.65rem)`,
              top: `calc(${node.y}% - 2.65rem)`,
            }}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
            animate={
              reduceMotion
                ? undefined
                : {
                    opacity: 1,
                    scale: [1, 1.05, 1],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 2.4,
                    delay: node.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 0.6,
                    ease: "easeInOut",
                  }
            }
          >
            <div
              className="relative flex h-[5.3rem] w-[5.3rem] items-center justify-center rounded-full border border-white/12 text-center shadow-[0_18px_40px_-24px_rgba(0,0,0,0.75)]"
              style={{ backgroundColor: node.color, color: "#14161a" }}
            >
              <motion.div
                className="absolute inset-[-0.5rem] rounded-full border border-white/20"
                animate={reduceMotion ? undefined : { scale: [0.9, 1.16], opacity: [0.55, 0] }}
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 2.2,
                        ease: "easeOut",
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.24,
                      }
                }
              />
              <div className="space-y-0.5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#14161a]/55">
                  {node.role}
                </p>
                <p className="text-sm font-semibold tracking-[-0.03em]">{node.label}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="absolute left-[50%] top-[50%] flex w-[15.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-between gap-4 rounded-[1.35rem] border border-white/10 bg-black/28 px-4 py-3 backdrop-blur-xl"
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={reduceMotion ? undefined : { duration: 3.4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/45">
              Reveal lane
            </p>
            <p className="mt-1 text-sm font-medium text-[#f5ebd5]">
              Tree first. Loop once.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d6ff57] text-[#14161a]">
              <CheckCircle size={18} weight="bold" />
            </span>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#59c1ff]">
              <LinkSimple size={18} weight="bold" />
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
