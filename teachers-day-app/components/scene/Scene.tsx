"use client";
import { useEffect, useState, type CSSProperties } from "react";
import { PenLine } from "lucide-react";
import { DEPARTMENTS, FLOATING, SCENE, TAGS } from "@/lib/scene-config";
import { chalkFont, tagFont } from "./fonts";
import { ParallaxProvider } from "./parallax";
import AmbientLights, { ClassroomBackdrop, GrainOverlay, Vignette } from "./AmbientLights";
import Chalkboard from "./Chalkboard";
import NameTag from "./NameTag";
import FloatingItem from "./FloatingItem";
import DepartmentSwitcher from "./DepartmentSwitcher";

interface Props { dept: string; onDeptChange: (id: string) => void; onEnter: () => void }

export default function Scene({ dept, onDeptChange, onEnter }: Props) {
  const [auto, setAuto] = useState(SCENE.autoCycleSeconds > 0);
  const [intro, setIntro] = useState(true);
  const found = DEPARTMENTS.findIndex((x) => x.id === dept);
  const idx = found < 0 ? 0 : found;
  const d = DEPARTMENTS[idx];

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!auto || intro) return;
    const t = setTimeout(() => onDeptChange(DEPARTMENTS[(idx + 1) % DEPARTMENTS.length].id), SCENE.autoCycleSeconds * 1000);
    return () => clearTimeout(t);
  }, [auto, intro, idx, onDeptChange]);

  const pick = (id: string) => { setAuto(false); onDeptChange(id); }; // manual pick stops auto-cycle
  const vars = { "--ambient": d.color, "--ambient-soft": `${d.color}44` } as CSSProperties;

  return (
    <ParallaxProvider>
      <section className={`scene-root ${chalkFont.variable} ${tagFont.variable} relative h-full w-full overflow-hidden bg-[#1a120a] text-[#F5F1E6]`} style={vars}>
        <ClassroomBackdrop />
        <AmbientLights />

        <div className="absolute inset-0 z-10 grid place-items-center"><div className="-mt-[3vh]"><Chalkboard dept={d} intro={intro} /></div></div>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">{TAGS.map((t) => <NameTag key={t.label} {...t} />)}</div>
        <div aria-hidden className="pointer-events-none absolute inset-0 z-30">
          {[...FLOATING].sort((a, b) => a.depth - b.depth).map((f) => <FloatingItem key={f.src} {...f} />)}
        </div>

        <div className="absolute inset-x-0 top-3 z-40 flex items-center justify-center gap-2">
          <div role="img" aria-label="EVSU seal" className="h-8 w-8 rounded-full bg-cream bg-cover ring-2 ring-white/80" style={{ backgroundImage: "url(/logo.png)" }} />
          <p className="text-[10px] uppercase tracking-[.25em] text-[#F5F1E6]/90 sm:text-xs" style={{ fontFamily: "var(--font-tag)" }}>{SCENE.university}</p>
        </div>

        <div className="absolute inset-x-0 bottom-[4%] z-40 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-5">
          <DepartmentSwitcher value={d.id} onChange={pick} />
          <button autoFocus onClick={onEnter} style={{ fontFamily: "var(--font-tag)", boxShadow: "0 0 28px var(--ambient)", "--ring": "rgba(245,241,230,.45)" } as CSSProperties}
            className="cta-pulse inline-flex items-center gap-2 rounded-full bg-[#F5F1E6] px-7 py-3 text-[#1F3A2B] transition hover:-translate-y-0.5 active:scale-95">
            <PenLine className="h-5 w-5" /> Write a message
          </button>
        </div>

        {SCENE.credit && <p className="absolute bottom-2 left-3 z-40 text-[10px] uppercase tracking-widest text-white/60" style={{ fontFamily: "var(--font-tag)" }}>{SCENE.credit}</p>}
        <Vignette />
        <GrainOverlay />
      </section>
    </ParallaxProvider>
  );
}