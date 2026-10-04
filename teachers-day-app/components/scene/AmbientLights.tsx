"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// deterministic pseudo-random so server and client render the same positions
const r = (n: number) => +((Math.abs(Math.sin(n * 12.9898) * 43758.5453) % 1).toFixed(3));
const BOKEH = Array.from({ length: 14 }, (_, i) => ({ x: r(i + 1) * 100, y: r(i + 31) * 100, s: 50 + r(i + 61) * 150, o: 0.25 + r(i + 91) * 0.35, d: 16 + r(i + 121) * 16 }));
const SPARKS = Array.from({ length: 24 }, (_, i) => ({ x: r(i + 7) * 100, y: 45 + r(i + 37) * 55, rise: 120 + r(i + 67) * 220, d: 6 + r(i + 97) * 6, delay: r(i + 127) * 6 }));

// Blurred classroom. Drop /public/bg/classroom.png in and it replaces the placeholder shapes.
export function ClassroomBackdrop() {
  const [missing, setMissing] = useState(false);
  const probe = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = probe.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-6" style={{
        backgroundImage: "url(/bg/classroom.png), radial-gradient(ellipse at 50% 35%, #7a5230 0%, #3a2616 55%, #140d07 100%)",
        backgroundSize: "cover", backgroundPosition: "center", filter: "blur(7px) saturate(1.1)",
      }} />
      {missing && [8, 38, 66].map((l) => (
        <div key={l} className="absolute bottom-[6%]" style={{ left: `${l}%` }}>
          <div className="mb-1 ml-[20%] h-[7vh] w-[8vw] rounded-md bg-[#24160a]/70 blur-md" />
          <div className="h-[5vh] w-[20vw] rounded-md bg-[#2f1e0e]/80 blur-md" />
        </div>
      ))}
      <img ref={probe} src="/bg/classroom.png" alt="" className="hidden" onError={() => setMissing(true)} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 15%, rgba(255,205,120,.4), transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 45%, var(--ambient-soft), transparent 62%)" }} />
    </div>
  );
}

// Bokeh, passing light streaks and rising sparks, all tinted by --ambient.
export default function AmbientLights() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {BOKEH.map((b, i) => (
        <motion.span key={i} className="absolute rounded-full mix-blend-screen"
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.s, height: b.s, opacity: b.o, background: "radial-gradient(circle, var(--ambient-soft) 0%, transparent 70%)" }}
          animate={reduce ? undefined : { x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
          transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      {!reduce && [0, 1].map((i) => (
        <motion.div key={i} className="absolute h-[2px] w-[60vw]"
          style={{ top: i ? "64%" : "27%", rotate: i ? -4 : 3, filter: "blur(1px)", background: "linear-gradient(90deg, transparent, var(--ambient), rgba(255,248,220,.9), transparent)" }}
          initial={{ x: "-70vw", opacity: 0 }} animate={{ x: "130vw", opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatDelay: 5 + i * 3, delay: 2 + i * 2, ease: "easeInOut" }} />
      ))}
      {!reduce && SPARKS.map((s, i) => (
        <motion.span key={i} className="absolute h-[3px] w-[3px] rounded-full bg-[#ffe9b0]"
          style={{ left: `${s.x}%`, top: `${s.y}%`, boxShadow: "0 0 8px 2px rgba(255,220,140,.7)" }}
          animate={{ y: [0, -s.rise], opacity: [0, 1, 0] }}
          transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease: "easeOut" }} />
      ))}
    </div>
  );
}

export function GrainOverlay() {
  return <div aria-hidden className="grain pointer-events-none absolute inset-0 z-50" style={{ opacity: 0.28 }} />;
}

export function Vignette() {
  return <div aria-hidden className="pointer-events-none absolute inset-0 z-50" style={{ background: "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,.7) 100%)" }} />;
}