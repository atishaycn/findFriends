"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";

export function MagneticLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });
  const springY = useSpring(y, { stiffness: 120, damping: 18 });
  const rotate = useTransform(springX, [-10, 10], [-1.5, 1.5]);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (bounds.left + bounds.width / 2);
    const offsetY = event.clientY - (bounds.top + bounds.height / 2);

    x.set(offsetX / 10);
    y.set(offsetY / 10);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ x: springX, y: springY, rotate }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="will-change-transform"
    >
      <Link
        href={href}
        className={`${variant === "primary" ? "primary-button" : "secondary-button"} ${className}`}
      >
        {children}
      </Link>
    </motion.div>
  );
}
