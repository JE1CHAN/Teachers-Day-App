'use client';
import { DEPARTMENTS, DEPT_KEYS } from '@/lib/departments';

export default function DepartmentPills({ value, onChange, allowAll = false, size = 'md' }) {
  const keys = allowAll ? ['All', ...DEPT_KEYS] : DEPT_KEYS;
  return (
    <div role="tablist" className="flex flex-wrap gap-2">
      {keys.map((k) => {
        const active = value === k;
        const accent = k === 'All' ? 'bg-stone-700' : DEPARTMENTS[k].accent;
        return (
          <button key={k} role="tab" aria-selected={active} onClick={() => onChange(k)}
            className={`rounded-full font-extrabold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-stone-400/60 ${size === 'sm' ? 'px-3 py-1 text-sm' : 'px-5 py-2'} ${active ? `${accent} text-white shadow-md scale-105` : 'bg-white/70 text-stone-600 hover:bg-white'}`}>
            {k}
          </button>
        );
      })}
    </div>
  );
}
