// Full class strings live here so Tailwind can detect them.
export const DEPARTMENTS = {
  IT: {
    fullName: "IT Department",
    gradient: "from-[#eaf3ef] via-[#a9cbbf] to-[#86b3a3]",
    accent: "bg-[#1d4138]",
    border: "border-[#a9cbbf]",
    text: "text-[#1d4138]",
    soft: "bg-[#d4e6df]",
    palette: ["#1d4138", "#5b8f7e", "#a9cbbf"],
  },
  HTM: {
    fullName: "HTM Department",
    gradient: "from-green-50 via-teal-50 to-emerald-100",
    accent: "bg-teal-500",
    border: "border-teal-300",
    text: "text-teal-800",
    soft: "bg-teal-100",
    palette: ["#0f766e", "#2dd4bf", "#99f6e4"],
  },
  Technology: {
    fullName: "Technology Department",
    gradient: "from-amber-50 via-yellow-100 to-amber-200",
    accent: "bg-amber-500",
    border: "border-amber-300",
    text: "text-amber-800",
    soft: "bg-amber-100",
    palette: ["#b45309", "#f59e0b", "#fde68a"],
  },
  Education: {
    fullName: "Education Department",
    gradient: "from-sky-50 via-blue-100 to-indigo-100",
    accent: "bg-sky-500",
    border: "border-sky-300",
    text: "text-sky-800",
    soft: "bg-sky-100",
    palette: ["#0369a1", "#38bdf8", "#bae6fd"],
  },
  Engineering: {
    fullName: "Engineering Department",
    gradient: "from-rose-50 via-red-100 to-rose-200",
    accent: "bg-rose-500",
    border: "border-rose-300",
    text: "text-rose-800",
    soft: "bg-rose-100",
    palette: ["#be123c", "#fb7185", "#fecdd3"],
  },
};
export const DEPT_KEYS = Object.keys(DEPARTMENTS);
export const NEUTRAL_GRADIENT = "from-orange-50 via-amber-50 to-rose-100";
