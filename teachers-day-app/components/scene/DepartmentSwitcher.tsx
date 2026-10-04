"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEPARTMENTS } from "@/lib/scene-config";

export default function DepartmentSwitcher({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const i = Math.max(0, DEPARTMENTS.findIndex((d) => d.id === value));
  const n = DEPARTMENTS.length;
  const step = (s: number) => onChange(DEPARTMENTS[(i + s + n) % n].id);
  return (
    <div role="tablist" aria-label="Department" className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur">
      <button aria-label="Previous department" onClick={() => step(-1)} className="rounded-full p-1 text-[#F5F1E6] hover:bg-white/15"><ChevronLeft className="h-5 w-5" /></button>
      {DEPARTMENTS.map((d) => {
        const active = d.id === value;
        return (
          <button key={d.id} role="tab" aria-selected={active} aria-label={d.name} title={d.name} onClick={() => onChange(d.id)}
            className={`h-3 w-3 rounded-full transition ${active ? "scale-150" : "opacity-60 hover:opacity-100"}`}
            style={{ background: d.color, boxShadow: active ? `0 0 12px ${d.color}` : undefined }} />
        );
      })}
      <span className="ml-1 hidden min-w-[9.5rem] text-center text-sm text-[#F5F1E6] sm:inline" style={{ fontFamily: "var(--font-tag)" }}>{DEPARTMENTS[i].name}</span>
      <button aria-label="Next department" onClick={() => step(1)} className="rounded-full p-1 text-[#F5F1E6] hover:bg-white/15"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
}