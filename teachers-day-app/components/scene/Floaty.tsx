"use client";
import type { ReactNode } from "react";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useParallax } from "./parallax";

interface Props {
  x: string; y: string; depth: number; rotation?: number; duration?: number;
  amplitude?: number; className?: string; children: ReactNode;
}

export default function Floaty({ x, y, depth, rotation = 0, duration = 7, amplitude = 12, className = "", children }: Props) {
  const reduce = useReducedMotion();
  const { x: px, y: py } = useParallax();
  const tx = useTransform(px, (v) => v * depth * 28);
  const ty = useTransform(py, (v) => v * depth * 20);

  return (
    <motion.div className={`pointer-events-none absolute ${className}`} style={{ left: x, top: y, x: tx, y: ty, zIndex: Math.round(depth * 10) }}>
      <motion.div
        style={{ rotate: rotation }}
        animate={reduce ? undefined : { y: [0, -amplitude, 0], rotate: [rotation, rotation + 3, rotation] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}