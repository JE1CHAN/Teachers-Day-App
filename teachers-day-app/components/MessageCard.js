import { forwardRef } from "react";
import { Heart, Star } from "lucide-react";
import FitText from "./FitText";
import { DEPARTMENTS } from "@/lib/departments";

const SIZES = {
  md: {
    pad: "p-[6%]",
    badge: "text-sm px-4 py-1",
    to: "text-[length:clamp(1.1rem,3vw,2rem)]",
    from: "text-base",
    star: "h-8 w-8",
  },
  lg: {
    pad: "p-[4%]",
    badge: "text-[length:clamp(1rem,2.2vw,2.2rem)] px-[1.2em] py-[.3em]",
    to: "text-[length:clamp(2rem,4.6vw,4.5rem)]",
    from: "text-[length:clamp(1.25rem,2.8vw,3rem)]",
    star: "h-12 w-12",
  },
};

// Fills its parent. size="lg" is for the projector slideshow.
const MessageCard = forwardRef(function MessageCard(
  { to, message, from, dept, maxFont = 64, size = "md" },
  ref,
) {
  const d = DEPARTMENTS[dept];
  const z = SIZES[size];
  return (
    <div
      ref={ref}
      className={`relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border-4 ${d.border} bg-white ${z.pad} shadow-xl`}
    >
      <div
        className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${d.soft}`}
      />
      <Star
        className={`absolute right-[5%] top-[5%] ${z.star} ${d.text}`}
        fill="currentColor"
      />
      <span
        className={`z-10 w-fit rounded-full ${d.accent} ${z.badge} font-extrabold text-white`}
      >
        From {d.fullName}
      </span>
      <p className={`z-10 mt-4 font-black ${z.to} ${d.text}`}>
        Dear {to?.trim() || "Teacher"},
      </p>
      <div className="z-10 my-3 min-h-0 flex-1 font-semibold text-stone-700">
        <FitText
          text={message?.trim() || "Your message will appear here…"}
          max={maxFont}
        />
      </div>
      <div
        className={`z-10 flex items-center justify-end gap-[.5em] font-extrabold text-stone-600 ${z.from}`}
      >
        <Heart
          className={`h-[1.1em] w-[1.1em] ${d.text}`}
          fill="currentColor"
        />
        <span>with love, {from?.trim() || "Anonymous"}</span>
      </div>
    </div>
  );
});
export default MessageCard;
