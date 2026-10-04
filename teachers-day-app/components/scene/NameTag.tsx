import Floaty from "./Floaty";
import type { Tag } from "@/lib/scene-config";

export default function NameTag({ label, x, y, rotate, depth, mobile }: Tag) {
  return (
    <Floaty x={x} y={y} depth={depth} rotation={rotate} duration={6 + depth * 3} amplitude={9} className={mobile ? "" : "hidden md:block"}>
      <span
        className="inline-block whitespace-nowrap rounded-full bg-white px-4 py-1.5 text-[clamp(.8rem,1.5vw,1.3rem)] text-stone-900"
        style={{ fontFamily: "var(--font-tag)", boxShadow: "0 10px 24px rgba(0,0,0,.35), 0 0 26px var(--ambient)" }}
      >
        <span style={{ color: "var(--ambient)" }}>&ldquo;</span>{label}<span style={{ color: "var(--ambient)" }}>&rdquo;</span>
      </span>
    </Floaty>
  );
}