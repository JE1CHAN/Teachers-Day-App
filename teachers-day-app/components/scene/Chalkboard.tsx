"use client";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SCENE, type Dept } from "@/lib/scene-config";

const CHALK = "#F5F1E6";
const chalk: CSSProperties = {
  color: CHALK, fontFamily: "var(--font-chalk), cursive", whiteSpace: "nowrap", lineHeight: 1.1,
  textShadow: "0 0 10px rgba(245,241,230,.35)", filter: "url(#chalk-rough)",
};
const dur = (t: string) => Math.max(0.5, t.length * 0.06);

// Writes left to right with a little chalk dust falling from the "pen" position.
function ChalkLine({ text, size, delay }: { text: string; size: string; delay: number }) {
  const reduce = useReducedMotion();
  const d = dur(text);
  if (reduce) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay * 0.4, duration: 0.8 }}>
        <div style={{ ...chalk, fontSize: size }}>{text}</div>
      </motion.div>
    );
  }
  return (
    <div className="relative w-fit">
      <motion.div initial={{ clipPath: "inset(-20% 100% -20% 0)" }} animate={{ clipPath: "inset(-20% -5% -20% 0)" }}
        transition={{ delay, duration: d, ease: "linear" }}>
        <div style={{ ...chalk, fontSize: size }}>{text}</div>
      </motion.div>
      <motion.div className="pointer-events-none absolute top-0 h-full" initial={{ left: "0%", opacity: 1 }} animate={{ left: "100%", opacity: [1, 1, 0] }}
        transition={{ left: { delay, duration: d, ease: "linear" }, opacity: { delay, duration: d, times: [0, 0.97, 1] } }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.i key={i} className="absolute top-[85%] h-[3px] w-[3px] rounded-full" style={{ left: i * 4 - 8, background: CHALK }}
            animate={{ y: [0, 26 + i * 6], opacity: [0.9, 0] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />
        ))}
      </motion.div>
    </div>
  );
}

function Doodle({ d, className, delay, vb = "0 0 24 24" }: { d: string; className: string; delay: number; vb?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox={vb} className={className} fill="none" stroke={CHALK} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#chalk-rough)" }} aria-hidden>
      <motion.path d={d} initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={reduce ? { opacity: 0.9 } : { pathLength: 1, opacity: 1 }}
        transition={{ delay, duration: 1.1, ease: "easeInOut" }} />
    </svg>
  );
}

const HEART = "M12 21 C4 14 2 9 5 6 C8 3 11 5 12 8 C13 5 16 3 19 6 C22 9 20 14 12 21 Z";
const STAR = "M12 3 L14.5 9 L21 9.5 L16 14 L17.5 20.5 L12 17 L6.5 20.5 L8 14 L3 9.5 L9.5 9 Z";
const SWIRL = "M4 18 C4 8 18 6 18 13 C18 18 10 18 10 13 C10 10 14 10 14 12";

export default function Chalkboard({ dept, intro }: { dept: Dept; intro: boolean }) {
  const base = intro ? 2.0 : 0.1;
  const nameEnd = base + dur(dept.name) + 0.2;
  const line1End = nameEnd + dur(dept.message[0]) + 0.15;

  return (
    <div className="w-[92vw] md:w-[min(66vw,95vh)]" style={{ containerType: "inline-size" }}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <filter id="chalk-rough"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" /></filter>
      </svg>

      {/* wood frame */}
      <div className="rounded-[1.2cqw] p-[2.2cqw]" style={{
        background: "repeating-linear-gradient(90deg, rgba(60,30,8,0) 0 5px, rgba(60,30,8,.12) 5px 6px, rgba(255,230,180,.07) 6px 11px), linear-gradient(135deg,#C68B4E,#8B5A2B 45%,#B07A3E 70%,#7a4d22)",
        boxShadow: "0 30px 60px rgba(0,0,0,.55), inset 0 2px 2px rgba(255,235,200,.5), inset 0 -4px 8px rgba(0,0,0,.5), 0 0 90px var(--ambient-soft)",
      }}>
        {/* board surface */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[.6cqw] md:aspect-[16/10]" style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,.10), transparent 60%), radial-gradient(ellipse 30% 12% at 22% 70%, rgba(255,255,255,.07), transparent 70%), radial-gradient(ellipse 35% 10% at 75% 30%, rgba(255,255,255,.06), transparent 70%), radial-gradient(ellipse 25% 14% at 60% 82%, rgba(255,255,255,.06), transparent 70%), linear-gradient(135deg,#2E5A3F,#1F3A2B)",
          boxShadow: "inset 0 0 6cqw rgba(0,0,0,.65)",
        }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 45% at 50% 40%, var(--ambient-soft), transparent 70%)", mixBlendMode: "screen", opacity: 0.8 }} />
          <div className="grain absolute inset-0" style={{ opacity: 0.45 }} />

          {/* ghosts of erased writing */}
          <div aria-hidden className="absolute bottom-[8%] left-[7%] -rotate-6 blur-[.5px]" style={{ ...chalk, opacity: 0.07, fontSize: "3cqw", filter: "none" }}>x² + y² = r²</div>
          <div aria-hidden className="absolute right-[8%] top-[46%] rotate-3 blur-[.5px]" style={{ ...chalk, opacity: 0.06, fontSize: "2.6cqw", filter: "none" }}>2 + 2 = 4</div>

          <Doodle d={HEART} delay={1.9} className="absolute left-[5%] top-[8%] w-[7cqw]" />
          <Doodle d={STAR} delay={2.1} className="absolute right-[6%] top-[9%] w-[7cqw]" />
          <Doodle d={SWIRL} delay={2.3} className="absolute bottom-[7%] right-[6%] w-[7cqw]" />
          <Doodle d={HEART} delay={2.5} className="absolute bottom-[8%] left-[6%] w-[5cqw]" />

          <div className="relative flex h-full flex-col items-center justify-center gap-[1.2cqw] px-[4%]">
            <ChalkLine text={SCENE.headline[0]} size="max(2rem, 10.5cqw)" delay={0.3} />
            <ChalkLine text={SCENE.headline[1]} size="max(1.7rem, 9cqw)" delay={0.8} />
            <Doodle d="M2 5 C25 1 50 7 98 3" vb="0 0 100 8" delay={1.6} className="w-[52cqw]" />

            <AnimatePresence mode="wait">
              <motion.div key={dept.id} initial={false} animate={{ clipPath: "inset(-20% -5% -20% 0%)" }}
                exit={{ clipPath: "inset(-20% -5% -20% 100%)", transition: { duration: 0.5, ease: "easeIn" } }}
                className="flex flex-col items-center gap-[1cqw]">
                <ChalkLine text={dept.name} size="max(.95rem, 4.4cqw)" delay={base} />
                <ChalkLine text={dept.message[0]} size="max(.8rem, 2.9cqw)" delay={nameEnd} />
                <ChalkLine text={dept.message[1]} size="max(.8rem, 2.9cqw)" delay={line1End} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* chalk tray (placeholders: sticks + eraser) */}
      <div className="relative mx-auto -mt-[.3cqw] h-[2.6cqw] w-[104%] -translate-x-[2%] rounded-b-[.5cqw]" style={{ background: "linear-gradient(#b07a3e,#6e4421)", boxShadow: "0 12px 20px rgba(0,0,0,.5), inset 0 2px 2px rgba(255,235,200,.4)" }}>
        {[[10, -4], [19, 3], [26, -2]].map(([l, rot]) => (
          <span key={l} className="absolute -top-[1cqw] h-[1.3cqw] w-[6cqw] rounded-full" style={{ left: `${l}%`, background: CHALK, rotate: `${rot}deg`, boxShadow: "0 2px 3px rgba(0,0,0,.4)" }} />
        ))}
        <span className="absolute -top-[1.8cqw] right-[12%] h-[2.2cqw] w-[8cqw] rounded-[.3cqw]" style={{ background: "#3b2a1d", borderTop: ".8cqw solid #c9b27a", boxShadow: "0 2px 4px rgba(0,0,0,.5)" }} />
      </div>
    </div>
  );
}