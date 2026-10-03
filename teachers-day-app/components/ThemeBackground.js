import { DEPARTMENTS, NEUTRAL_GRADIENT } from "@/lib/departments";

const NEUTRAL_PALETTE = ["#9a3412", "#f59e0b", "#fdba74"];
// c: 0 dark, 1 mid, 2 light, 3 white. dx/dy = how far it travels, dur = seconds one way.
const SHAPES = [
  {
    t: "circle",
    s: 260,
    x: "6%",
    y: "12%",
    dx: "28vw",
    dy: "14vh",
    rot: "0deg",
    dur: 15,
    c: 0,
    o: 0.18,
  },
  {
    t: "ring",
    s: 200,
    x: "72%",
    y: "8%",
    dx: "-20vw",
    dy: "30vh",
    rot: "120deg",
    dur: 13,
    c: 1,
    o: 0.5,
  },
  {
    t: "diamond",
    s: 120,
    x: "20%",
    y: "70%",
    dx: "30vw",
    dy: "-22vh",
    rot: "180deg",
    dur: 11,
    c: 0,
    o: 0.25,
  },
  {
    t: "pill",
    s: 240,
    x: "80%",
    y: "62%",
    dx: "-34vw",
    dy: "-10vh",
    rot: "-90deg",
    dur: 16,
    c: 3,
    o: 0.55,
  },
  {
    t: "circle",
    s: 90,
    x: "45%",
    y: "80%",
    dx: "-18vw",
    dy: "-30vh",
    rot: "0deg",
    dur: 10,
    c: 1,
    o: 0.5,
  },
  {
    t: "ring",
    s: 140,
    x: "35%",
    y: "6%",
    dx: "22vw",
    dy: "26vh",
    rot: "200deg",
    dur: 12,
    c: 0,
    o: 0.3,
  },
  {
    t: "diamond",
    s: 80,
    x: "88%",
    y: "35%",
    dx: "-26vw",
    dy: "20vh",
    rot: "90deg",
    dur: 9,
    c: 1,
    o: 0.55,
  },
  {
    t: "circle",
    s: 170,
    x: "58%",
    y: "45%",
    dx: "16vw",
    dy: "-24vh",
    rot: "0deg",
    dur: 14,
    c: 3,
    o: 0.45,
  },
];

// Parent must be `relative`. Crossfades between department gradients; shapes only when `animated`.
export default function ThemeBackground({ dept, animated = false }) {
  const layers = [
    ...Object.entries(DEPARTMENTS).map(([k, v]) => [k, v.gradient]),
    ["neutral", NEUTRAL_GRADIENT],
  ];
  const active = DEPARTMENTS[dept] ? dept : "neutral";
  const palette = [
    ...(DEPARTMENTS[dept]?.palette ?? NEUTRAL_PALETTE),
    "#ffffff",
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {layers.map(([k, g]) => (
        <div
          key={k}
          className={`absolute inset-0 bg-gradient-to-br ${g} transition-opacity duration-700 ${animated ? "animate-bg" : ""} ${k === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {animated &&
        SHAPES.map((s, i) => {
          const color = palette[s.c];
          const look =
            s.t === "ring"
              ? {
                  borderRadius: "50%",
                  border: `${Math.round(s.s / 9)}px solid ${color}`,
                }
              : {
                  borderRadius: s.t === "diamond" ? "18%" : "999px",
                  background: color,
                };
          return (
            <span
              key={i}
              className="shape"
              style={{
                left: s.x,
                top: s.y,
                width: s.s,
                height: s.t === "pill" ? s.s / 3 : s.s,
                opacity: s.o,
                transition: "background-color .7s, border-color .7s",
                "--dx": s.dx,
                "--dy": s.dy,
                "--rot": s.rot,
                "--dur": `${s.dur}s`,
                ...look,
              }}
            />
          );
        })}
    </div>
  );
}
