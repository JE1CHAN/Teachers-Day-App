"use client";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";

type Ctx = { x: MotionValue<number>; y: MotionValue<number> };
const ParallaxCtx = createContext<Ctx | null>(null);

// Mouse on desktop, tilt on phones that support it. Disabled for reduced motion.
export function ParallaxProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(rx, { stiffness: 50, damping: 18 });
  const y = useSpring(ry, { stiffness: 50, damping: 18 });

  useEffect(() => {
    if (reduce) return;
    const move = (e: PointerEvent) => {
      rx.set((e.clientX / window.innerWidth - 0.5) * 2);
      ry.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const tilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      rx.set(Math.max(-1, Math.min(1, e.gamma / 30)));
      ry.set(Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("deviceorientation", tilt);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tilt);
    };
  }, [reduce, rx, ry]);

  return <ParallaxCtx.Provider value={{ x, y }}>{children}</ParallaxCtx.Provider>;
}

export function useParallax() {
  const c = useContext(ParallaxCtx);
  if (!c) throw new Error("useParallax must be used inside ParallaxProvider");
  return c;
}