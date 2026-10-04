"use client";
import { useEffect, useRef, useState } from "react";
import Floaty from "./Floaty";
import type { FloatingConfig } from "@/lib/scene-config";

export default function FloatingItem({ src, alt, size, x, y, depth, rotation = 0, blur = 0, floatDuration = 7, hideOnMobile }: FloatingConfig) {
  const [missing, setMissing] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // catches images that already failed before React attached onError
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setMissing(true);
  }, []);

  return (
    <Floaty x={x} y={y} depth={depth} rotation={rotation} duration={floatDuration} className={hideOnMobile ? "hidden md:block" : ""}>
      <div style={{ width: `${size}vmin`, filter: blur ? `blur(${blur}px)` : undefined }}>
        {missing ? (
          <div className="grid aspect-square place-items-center break-all rounded-lg border-2 border-dashed border-white/70 bg-black/25 p-1 text-center text-[10px] font-bold text-white/90">
            {src.split("/").pop()}
          </div>
        ) : (
          <img ref={img} src={src} alt={alt} draggable={false} onError={() => setMissing(true)}
            className="h-auto w-full drop-shadow-[0_14px_20px_rgba(0,0,0,.45)]" />
        )}
      </div>
    </Floaty>
  );
}