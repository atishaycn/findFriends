"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pulseTicker } from "./pulse-content";

const repeatedItems = [...pulseTicker, ...pulseTicker];

export function PulseTickerBand() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-y border-white/10 bg-[#111318] py-3">
      <motion.div
        className="flex min-w-max items-center gap-3 pr-3"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 20, ease: "linear", repeat: Number.POSITIVE_INFINITY }
        }
      >
        {repeatedItems.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center gap-3 whitespace-nowrap pl-3"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#d6ff57]" />
            <span className="text-sm font-medium uppercase tracking-[0.34em] text-[#f5ebd5]/80">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
