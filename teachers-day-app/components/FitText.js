"use client";
import { useLayoutEffect, useRef } from "react";

// Shrinks font-size (binary search) until the text fits its parent box without breaking words.
export default function FitText({ text, max = 64, min = 14, className = "" }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const overflows = () =>
      el.scrollHeight > el.clientHeight + 1 ||
      el.scrollWidth > el.clientWidth + 1;
    const fit = () => {
      el.style.overflowWrap = "normal";
      el.style.wordBreak = "normal";
      let lo = min;
      // cap by box width so narrow phone cards never get giant text
      let hi = Math.max(min, Math.min(max, Math.round(el.clientWidth * 0.14)));
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        el.style.fontSize = mid + "px";
        if (overflows()) hi = mid - 1;
        else lo = mid;
      }
      el.style.fontSize = lo + "px";
      // last resort: a single super-long word may break
      if (overflows()) el.style.overflowWrap = "anywhere";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, max, min]);
  return (
    <div
      ref={ref}
      className={`h-full w-full overflow-hidden leading-snug ${className}`}
    >
      {text}
    </div>
  );
}
