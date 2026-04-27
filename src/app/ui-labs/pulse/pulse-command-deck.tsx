"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Pulse, Queue } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { pulsePrompts } from "./pulse-content";

export function PulseCommandDeck() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % pulsePrompts.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [reduceMotion]);

  const activePrompt = pulsePrompts[activeIndex];

  return (
    <div className="flex h-full flex-col justify-between gap-6 rounded-[2rem] bg-[#ff6b3d] p-5 text-[#14161a] sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#14161a]/58">
            Control room
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] sm:text-[2.65rem]">
            One command. One visible next move.
          </h2>
        </div>
        <div className="rounded-full border border-[#14161a]/15 bg-white/28 p-3">
          <Queue size={24} weight="bold" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-[#14161a]/12 bg-[#14161a] p-4 text-[#f5ebd5] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-white/52">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d6ff57]" />
            live prompt lane
          </div>
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-white/45">
            <Pulse size={14} weight="fill" />
            standby
          </div>
        </div>

        <div className="relative mt-5 min-h-[9.5rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePrompt.label}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-[#d6ff57]">
                <span className="h-2 w-2 rounded-full bg-current" />
                {activePrompt.note}
              </div>
              <p className="max-w-[18ch] text-3xl font-semibold tracking-[-0.06em] text-balance sm:text-[2.75rem]">
                {activePrompt.label}
              </p>
              <p className="max-w-md text-sm leading-7 text-white/70">
                {activePrompt.detail}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              key={activePrompt.label}
              className="h-full rounded-full bg-[#d6ff57]"
              initial={reduceMotion ? false : { scaleX: 0, transformOrigin: "left" }}
              animate={reduceMotion ? undefined : { scaleX: 1, transformOrigin: "left" }}
              transition={reduceMotion ? undefined : { duration: 2.35, ease: "linear" }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Launch board runs edge-to-edge.",
              "Motion is isolated in this route only.",
              "Reveal lane stays hidden until close.",
              "Palette stays loud but disciplined.",
            ].map((line, index) => (
              <motion.div
                key={line}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-[1.25rem] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-white/70"
              >
                {line}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-[1.4rem] border border-[#14161a]/12 bg-[#f5ebd5] px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#14161a]/48">
            Startup feel
          </p>
          <p className="mt-1 text-sm font-medium text-[#14161a]/72">
            Crisp command language with motion doing the selling.
          </p>
        </div>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#14161a] text-[#f5ebd5]">
          <ArrowRight size={18} weight="bold" />
        </div>
      </div>
    </div>
  );
}
