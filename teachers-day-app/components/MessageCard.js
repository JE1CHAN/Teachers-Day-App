import { forwardRef } from "react";
import { Heart } from "lucide-react";
import FitText from "./FitText";
import { DEPARTMENTS } from "@/lib/departments";

const SIZES = {
  md: {
    pad: "p-[8%]",
    label: "text-sm",
    to: "text-[length:clamp(1.5rem,3.8vw,2.5rem)]",
    from: "text-[length:clamp(1.1rem,2.2vw,1.5rem)]",
    fold: 46,
  },
  lg: {
    pad: "p-[5%]",
    label: "text-[length:clamp(1rem,2vw,2rem)]",
    to: "text-[length:clamp(2.4rem,5vw,5rem)]",
    from: "text-[length:clamp(1.4rem,3vw,3.2rem)]",
    fold: 96,
  },
};

// Sticky note that fills its parent. size="lg" is for the projector slideshow.
const MessageCard = forwardRef(function MessageCard(
  { to, message, from, dept, maxFont = 64, size = "md" },
  ref,
) {
  const d = DEPARTMENTS[dept];
  const z = SIZES[size];
  const f = z.fold;
  return (
    <div ref={ref} className="relative h-full w-full">
      {/* lifted-edge shadow under the note */}
      <div className="absolute -bottom-1 left-[8%] h-6 w-[55%] -rotate-1 rounded-full bg-black/30 blur-lg" />

      <div
        className="absolute inset-[1.5%] -rotate-1"
        style={{ filter: "drop-shadow(0 14px 14px rgba(0,0,0,.3))" }}
      >
        {/* note body, with the bottom-right corner cut away */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${d.noteLight} 0%, ${d.note} 18%, ${d.note} 70%, ${d.noteDeep} 100%)`,
            clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${f}px), calc(100% - ${f}px) 100%, 0 100%)`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[9%]"
            style={{
              background: "linear-gradient(rgba(0,0,0,.09), transparent)",
            }}
          />
          <div
            className="paper-grain pointer-events-none absolute inset-0"
            style={{ opacity: 0.18 }}
          />

          <div
            className={`relative flex h-full flex-col ${z.pad}`}
            style={{
              color: d.ink,
              fontFamily: "var(--font-marker), 'Comic Sans MS', cursive",
            }}
          >
            <span
              className={`w-fit -rotate-2 rounded-sm px-3 py-0.5 ${z.label}`}
              style={{ background: "rgba(255,255,255,.55)" }}
            >
              From {d.fullName}
            </span>
            <p className={`mt-3 leading-none ${z.to}`}>
              Dear {to?.trim() || "Teacher"},
            </p>
            <svg
              viewBox="0 0 120 8"
              className="mt-1 h-[.5em] w-[40%] text-[length:clamp(1rem,2vw,2rem)]"
              fill="none"
              stroke={d.ink}
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M2 5 C20 1 40 7 60 3 S100 6 118 3" />
            </svg>
            <div className="my-3 min-h-0 flex-1">
              <FitText
                text={message?.trim() || "Your message will appear here…"}
                max={maxFont}
              />
            </div>
            <div
              className={`flex items-center justify-end gap-2 ${z.from}`}
              style={{ paddingRight: f * 0.9 }}
            >
              <Heart className="h-[1em] w-[1em]" fill="currentColor" />
              <span>with love, {from?.trim() || "Anonymous"}</span>
            </div>
          </div>
        </div>

        {/* the folded-over corner */}
        <div
          className="absolute bottom-0 right-0"
          style={{
            width: f,
            height: f,
            filter: "drop-shadow(-3px -3px 4px rgba(0,0,0,.28))",
          }}
        >
          <div
            className="h-full w-full"
            style={{
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              background: `radial-gradient(circle at 0% 0%, rgba(255,255,255,.5), transparent 70%), linear-gradient(135deg, ${d.noteLight} 0%, ${d.note} 45%, ${d.noteDeep} 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
});
export default MessageCard;
