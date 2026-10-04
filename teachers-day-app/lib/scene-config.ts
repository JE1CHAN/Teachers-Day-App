export type DeptId = string;
export interface Dept { id: DeptId; name: string; color: string; message: string[] }
export interface Tag { label: string; x: string; y: string; rotate: number; depth: number; mobile?: boolean }
export interface FloatingConfig {
  src: string; alt: string; size: number; // size in vmin
  x: string; y: string; depth: number; rotation?: number; blur?: number; floatDuration?: number; hideOnMobile?: boolean;
}

export const SCENE = {
  headline: ["Happy", "Teachers' Day"],
  university: "Eastern Visayas State University",
  autoCycleSeconds: 9, // 0 turns auto-cycle off
  credit: "", // e.g. "Graphics by ..." (shown bottom-left if not empty)
};

// ids must match the keys in lib/departments.js. Keep message lines under ~32 characters.
export const DEPARTMENTS: Dept[] = [
  { id: "IT", name: "IT Department", color: "#7BC8A4", message: ["Thank you for teaching us to", "debug code and life."] },
  { id: "HTM", name: "HTM Department", color: "#2DD4D4", message: ["Thank you for showing us that", "service is an art."] },
  { id: "Technology", name: "Technology Department", color: "#F5B841", message: ["Thank you for building the", "makers of tomorrow."] },
  { id: "Education", name: "Education Department", color: "#4FA3E0", message: ["Thank you for shaping the minds", "that shape the world."] },
  { id: "Engineering", name: "Engineering Department", color: "#E0607E", message: ["Thank you for helping us", "build things that last."] },
];

// x / y are % of the screen. mobile:true keeps the tag on phones.
export const TAGS: Tag[] = [
  { label: "Binibini", x: "4%", y: "9%", rotate: -6, depth: 0.5, mobile: true },
  { label: "Ginoo", x: "70%", y: "7%", rotate: 5, depth: 0.7, mobile: true },
  { label: "Miss", x: "86%", y: "22%", rotate: -4, depth: 0.4 },
  { label: "Mister", x: "3%", y: "34%", rotate: 4, depth: 0.6 },
  { label: "Teacher", x: "6%", y: "64%", rotate: -5, depth: 0.8 },
  { label: "Sir", x: "87%", y: "62%", rotate: 6, depth: 0.9 },
  { label: "Ma'am", x: "8%", y: "86%", rotate: 5, depth: 0.5 },
  { label: "Teach", x: "72%", y: "88%", rotate: -4, depth: 0.7 },
  { label: "Ginang", x: "24%", y: "92%", rotate: 3, depth: 0.6 },
];

// Put your transparent PNGs at these paths. Until then a dashed placeholder box shows.
// depth: bigger = moves more with the mouse (about 0.3 far/background, 1.3 close/foreground).
export const FLOATING: FloatingConfig[] = [
  { src: "/floating/paper-plane-2.png", alt: "Paper plane", size: 9, x: "24%", y: "22%", depth: 0.3, rotation: -20, blur: 2.5, floatDuration: 10 },
  { src: "/floating/pencil-2.png", alt: "Pencil", size: 12, x: "76%", y: "78%", depth: 0.4, rotation: 70, blur: 2, floatDuration: 11 },
  { src: "/floating/paper-plane-1.png", alt: "Paper plane", size: 16, x: "78%", y: "10%", depth: 1, rotation: 15, blur: 1, floatDuration: 8 },
  { src: "/floating/chalk.png", alt: "Chalk", size: 12, x: "82%", y: "88%", depth: 0.8, rotation: 20, floatDuration: 7 },
  { src: "/floating/pencil-1.png", alt: "Pencil", size: 26, x: "-3%", y: "18%", depth: 1.3, rotation: -35, floatDuration: 9 },
  { src: "/floating/book.png", alt: "Book", size: 26, x: "-4%", y: "76%", depth: 1.2, rotation: -8, floatDuration: 8 },
  { src: "/floating/apple.png", alt: "Apple", size: 20, x: "86%", y: "74%", depth: 1.4, rotation: 12, floatDuration: 7 },
  { src: "/floating/hand-chalk.png", alt: "Hand writing with chalk", size: 34, x: "-7%", y: "48%", depth: 1.1, hideOnMobile: true, floatDuration: 9 },
];