"use client";

import {
  forwardRef,
  type ReactNode,
  useRef,
} from "react";
import {
  type HTMLMotionProps,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type MagneticButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton({ children, className, onPointerLeave, onPointerMove, ...props }, ref) {
    const prefersReducedMotion = useReducedMotion();
    const localRef = useRef<HTMLButtonElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 180, damping: 18 });
    const springY = useSpring(y, { stiffness: 180, damping: 18 });

    function setRefs(node: HTMLButtonElement | null) {
      localRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    return (
      <motion.button
        ref={setRefs}
        style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
        whileTap={{ scale: 0.98 }}
        className={className}
        onPointerMove={(event) => {
          onPointerMove?.(event);

          if (prefersReducedMotion || !localRef.current) {
            return;
          }

          const rect = localRef.current.getBoundingClientRect();
          const offsetX = event.clientX - rect.left - rect.width / 2;
          const offsetY = event.clientY - rect.top - rect.height / 2;
          x.set(offsetX * 0.08);
          y.set(offsetY * 0.08);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          x.set(0);
          y.set(0);
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
