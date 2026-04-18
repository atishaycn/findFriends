"use client";

import { BellSimpleRinging, LinkSimple, Pulse, Sparkle } from "@phosphor-icons/react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "framer-motion";
import { memo, useEffect, useState } from "react";

const queueSeed = [
  { id: "marlo", name: "Marlo Keene", state: "picked a new branch" },
  { id: "naya", name: "Naya Bloom", state: "claimed in 19 seconds" },
  { id: "soren", name: "Soren Hale", state: "still deciding" },
  { id: "vesper", name: "Vesper North", state: "passed it onward" },
];

const prompts = [
  "Find the one person who will surprise everyone.",
  "Start a chain without exposing the graph too early.",
  "Let the last link close somewhere unexpected.",
];

const stream = [
  "7 active loops",
  "19 fresh claims",
  "4 hidden returns blocked",
  "31 links in motion",
];

export const LiveSignalBoard = memo(function LiveSignalBoard() {
  const [queueIndex, setQueueIndex] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [showPing, setShowPing] = useState(true);

  useEffect(() => {
    const rotationId = window.setInterval(() => {
      setQueueIndex((value) => (value + 1) % queueSeed.length);
      setPromptIndex((value) => (value + 1) % prompts.length);
    }, 3200);

    return () => {
      window.clearInterval(rotationId);
    };
  }, []);

  useEffect(() => {
    setTypedLength(0);

    const text = prompts[promptIndex];
    const intervalId = window.setInterval(() => {
      setTypedLength((value) => {
        if (value >= text.length) {
          window.clearInterval(intervalId);
          return value;
        }

        return value + 1;
      });
    }, 32);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [promptIndex]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setShowPing((value) => !value);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const orderedQueue = queueSeed
    .slice(queueIndex)
    .concat(queueSeed.slice(0, queueIndex));

  return (
    <LayoutGroup>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.09,
            },
          },
        }}
        className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:grid-rows-[1fr_auto] lg:min-h-[34rem]"
      >
        <motion.section
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel p-5 md:row-span-2 md:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="section-kicker">Live queue</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Quietly reprioritizing the next move.
              </h3>
            </div>
            <span className="status-pill">
              <span className="status-dot" />
              Routing
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {orderedQueue.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="soft-panel flex items-center justify-between gap-4 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(47,108,87,0.12)] text-sm font-semibold text-[var(--accent-strong)]">
                    {item.name
                      .split(" ")
                      .map((segment) => segment[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--ink)]">{item.name}</p>
                    <p className="text-sm text-[var(--muted)]">{item.state}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-[var(--ink)]">0{index + 1}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-[rgba(18,23,20,0.42)]">
                    priority
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel p-5 md:p-6"
        >
          <div className="flex items-center justify-between">
            <p className="section-kicker">Prompt rail</p>
            <Sparkle size={18} weight="fill" className="text-[var(--accent)]" />
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[rgba(18,23,20,0.08)] bg-[rgba(18,23,20,0.04)] px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-[rgba(18,23,20,0.46)]">
              <Pulse size={16} />
              composing a better chain
            </div>
            <p className="mt-4 min-h-[4.8rem] text-lg leading-8 text-[var(--ink)]">
              {prompts[promptIndex].slice(0, typedLength)}
              <span className="ml-0.5 inline-block h-5 w-[2px] translate-y-1 animate-pulse bg-[var(--accent)]" />
            </p>
          </div>
        </motion.section>

        <motion.section
          variants={{
            hidden: { opacity: 0, y: 18 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="glass-panel overflow-hidden p-5 md:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Signals</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[var(--ink)]">
                Every round stays in motion.
              </h3>
            </div>
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-full bg-[rgba(47,108,87,0.12)] p-3 text-[var(--accent)]"
              >
                <LinkSimple size={18} weight="bold" />
              </motion.div>
              <AnimatePresence>
                {showPing ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 8 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="absolute -right-2 -top-2 rounded-full border border-white/80 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)] shadow-[0_12px_24px_-18px_rgba(31,36,31,0.4)]"
                  >
                    new claim
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[rgba(18,23,20,0.08)] bg-[rgba(255,255,255,0.5)] py-4">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 14, ease: "linear", repeat: Infinity }}
              className="flex min-w-max gap-3 px-4"
            >
              {[...stream, ...stream].map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="rounded-full border border-[rgba(18,23,20,0.08)] bg-[rgba(255,255,255,0.72)] px-4 py-2 text-sm text-[var(--ink)]"
                >
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[1.5rem] border border-[rgba(47,108,87,0.1)] bg-[rgba(220,233,226,0.74)] px-4 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--accent-strong)]">
                Notifications wake only when they matter.
              </p>
              <p className="text-sm text-[rgba(33,81,65,0.8)]">
                Returns get blocked. Real loops lock the graph.
              </p>
            </div>
            <BellSimpleRinging size={22} weight="duotone" className="text-[var(--accent)]" />
          </div>
        </motion.section>
      </motion.div>
    </LayoutGroup>
  );
});
