// Full class strings live here so Tailwind can detect them.
export const DEPARTMENTS = {
  IT:          { gradient: 'from-emerald-50 via-emerald-100 to-green-200', accent: 'bg-emerald-500', border: 'border-emerald-300', text: 'text-emerald-800', soft: 'bg-emerald-100', hex: '#10b981' },
  HTM:         { gradient: 'from-green-50 via-teal-50 to-emerald-100',     accent: 'bg-teal-500',    border: 'border-teal-300',    text: 'text-teal-800',    soft: 'bg-teal-100',    hex: '#14b8a6' },
  Technology:  { gradient: 'from-amber-50 via-yellow-100 to-amber-200',    accent: 'bg-amber-500',   border: 'border-amber-300',   text: 'text-amber-800',   soft: 'bg-amber-100',   hex: '#f59e0b' },
  Education:   { gradient: 'from-sky-50 via-blue-100 to-indigo-100',       accent: 'bg-sky-500',     border: 'border-sky-300',     text: 'text-sky-800',     soft: 'bg-sky-100',     hex: '#0ea5e9' },
  Engineering: { gradient: 'from-rose-50 via-red-100 to-rose-200',         accent: 'bg-rose-500',    border: 'border-rose-300',    text: 'text-rose-800',    soft: 'bg-rose-100',    hex: '#f43f5e' },
};
export const DEPT_KEYS = Object.keys(DEPARTMENTS);
export const NEUTRAL_GRADIENT = 'from-orange-50 via-amber-50 to-rose-100';
