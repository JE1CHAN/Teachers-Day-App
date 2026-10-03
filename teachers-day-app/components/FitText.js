'use client';
import { useLayoutEffect, useRef } from 'react';

// Shrinks font-size (binary search) until text fits its parent box. Parent needs a fixed/flex height.
export default function FitText({ text, max = 64, min = 14, className = '' }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      let lo = min, hi = max;
      while (lo < hi) {
        const mid = Math.ceil((lo + hi) / 2);
        el.style.fontSize = mid + 'px';
        if (el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth) hi = mid - 1; else lo = mid;
      }
      el.style.fontSize = lo + 'px';
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, max, min]);
  return <div ref={ref} className={`h-full w-full overflow-hidden break-words leading-snug ${className}`}>{text}</div>;
}
