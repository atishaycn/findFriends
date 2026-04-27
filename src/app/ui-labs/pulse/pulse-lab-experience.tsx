"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle, CompassTool, Pulse, UsersThree } from "@phosphor-icons/react";
import {
  pulseMetrics,
  pulseMilestones,
  pulseSignals,
} from "./pulse-content";
import { PulseCommandDeck } from "./pulse-command-deck";
import { PulseGraphBoard } from "./pulse-graph-board";
import { PulseTickerBand } from "./pulse-ticker-band";

const riseIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: index * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function PulseLabExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#0d0f13] text-[#f5ebd5]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] top-[-4%] h-[22rem] w-[22rem] rounded-full bg-[#ff6b3d]/24 blur-[120px]" />
        <div className="absolute right-[-4%] top-[14%] h-[18rem] w-[18rem] rounded-full bg-[#59c1ff]/16 blur-[110px]" />
        <div className="absolute bottom-[-8%] left-[28%] h-[22rem] w-[22rem] rounded-full bg-[#d6ff57]/14 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-[0.14]" />
      </div>

      <div className="relative z-10">
        <section className="mx-auto max-w-[1480px] px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#d6ff57] text-[#14161a]">
                <Pulse size={20} weight="bold" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                  Friend Graph
                </p>
                <p className="text-sm font-medium text-[#f5ebd5]">
                  UI Lab / Pulse / Concept D
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/46">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b3d]" />
              Self-contained route
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-[1480px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-6 lg:px-8 lg:py-6">
          <motion.div
            custom={0}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            variants={riseIn}
            className="grid gap-5"
          >
            <div className="overflow-hidden rounded-[2.5rem] bg-[#f5ebd5] text-[#14161a] shadow-[0_30px_100px_-46px_rgba(0,0,0,0.6)]">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_14rem] lg:p-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#14161a]/12 bg-white/55 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#14161a]/62">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b3d]" />
                    kinetic startup demo
                  </div>

                  <div className="space-y-4">
                    <h1 className="max-w-[11ch] text-5xl font-semibold tracking-[-0.08em] text-balance sm:text-7xl lg:text-[5.6rem] lg:leading-[0.88]">
                      Turn the hidden round into a live pulse.
                    </h1>
                    <p className="max-w-[34rem] text-base leading-8 text-[#14161a]/68 sm:text-lg">
                      Concept D treats Friend Graph like a launch board: bold
                      color planes, moving signal lanes, and a reveal that feels
                      earned when the closing line finally lands.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/studio"
                      className="inline-flex items-center gap-2 rounded-full bg-[#14161a] px-5 py-3 text-sm font-semibold text-[#f5ebd5]"
                    >
                      Open studio
                      <ArrowRight size={18} weight="bold" />
                    </Link>
                    <a
                      href="#control-room"
                      className="inline-flex items-center gap-2 rounded-full border border-[#14161a]/16 px-5 py-3 text-sm font-semibold text-[#14161a]"
                    >
                      Jump to control room
                    </a>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-[1.8rem] bg-[#14161a] p-4 text-[#f5ebd5]">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                      Core rule
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      Tree first. Loop once.
                    </p>
                  </div>
                  <div className="rounded-[1.8rem] bg-[#d6ff57] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#14161a]/56">
                      Demo intent
                    </p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.05em]">
                      Show suspense before the reveal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {pulseMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  custom={index + 1}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? undefined : "visible"}
                  viewport={{ once: true, margin: "-12%" }}
                  variants={riseIn}
                  className={`rounded-[2rem] p-5 ${
                    index === 0
                      ? "bg-[#ff6b3d] text-[#14161a]"
                      : index === 1
                        ? "bg-[#14161a] text-[#f5ebd5] border border-white/10"
                        : "bg-[#59c1ff] text-[#14161a]"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] opacity-60">
                    {metric.label}
                  </p>
                  <p className="mt-4 text-5xl font-semibold tracking-[-0.08em]">
                    {metric.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            custom={2}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            variants={riseIn}
            className="grid gap-5"
          >
            <PulseGraphBoard />

            <div className="grid gap-4 sm:grid-cols-3">
              {pulseSignals.map((signal, index) => (
                <motion.article
                  key={signal.title}
                  custom={index + 3}
                  initial={reduceMotion ? false : "hidden"}
                  whileInView={reduceMotion ? undefined : "visible"}
                  viewport={{ once: true, margin: "-12%" }}
                  variants={riseIn}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
                >
                  <div
                    className="h-1.5 w-14 rounded-full"
                    style={{ backgroundColor: signal.accent }}
                  />
                  <h2 className="mt-4 text-lg font-semibold tracking-[-0.04em] text-[#f5ebd5]">
                    {signal.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/64">
                    {signal.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </section>

        <PulseTickerBand />

        <section
          id="control-room"
          className="mx-auto grid max-w-[1480px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-6 lg:px-8 lg:py-6"
        >
          <motion.div
            custom={0}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={{ once: true, margin: "-8%" }}
            variants={riseIn}
          >
            <PulseCommandDeck />
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              custom={1}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, margin: "-8%" }}
              variants={riseIn}
              className="rounded-[2.25rem] border border-white/10 bg-[#14161a] p-5 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                    Motion thesis
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-[#f5ebd5]">
                    The reveal should feel like a system tipping into view.
                  </h2>
                </div>
                <div className="rounded-full bg-white/6 p-3 text-[#59c1ff]">
                  <CompassTool size={24} weight="bold" />
                </div>
              </div>

              <div className="mt-7 space-y-3">
                {pulseMilestones.map((step, index) => (
                  <motion.div
                    key={step.title}
                    custom={index + 2}
                    initial={reduceMotion ? false : "hidden"}
                    whileInView={reduceMotion ? undefined : "visible"}
                    viewport={{ once: true }}
                    variants={riseIn}
                    className="rounded-[1.7rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#d6ff57] text-[#14161a]">
                        <CheckCircle size={18} weight="bold" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.04em] text-[#f5ebd5]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-white/62">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              custom={2}
              initial={reduceMotion ? false : "hidden"}
              whileInView={reduceMotion ? undefined : "visible"}
              viewport={{ once: true, margin: "-8%" }}
              variants={riseIn}
              className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]"
            >
              <div className="rounded-[2rem] bg-[#d6ff57] p-5 text-[#14161a] sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#14161a]/52">
                      Audience read
                    </p>
                    <p className="mt-3 text-2xl font-semibold tracking-[-0.06em]">
                      Feels like the network is already waking up.
                    </p>
                  </div>
                  <UsersThree size={26} weight="bold" />
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#59c1ff] p-5 text-[#14161a] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#14161a]/52">
                  Route note
                </p>
                <p className="mt-3 text-base leading-7">
                  Everything here is isolated under the pulse lab subtree and
                  does not depend on shared components.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
