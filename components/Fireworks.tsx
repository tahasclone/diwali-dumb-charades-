"use client";

import { useEffect, useRef } from "react";
import { attachCanvas, resize } from "@/lib/fx";

export default function Fireworks() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    attachCanvas(ref.current);
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
      attachCanvas(null);
    };
  }, []);
  return <canvas id="fx" ref={ref} aria-hidden="true" />;
}
