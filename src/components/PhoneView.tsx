"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Landing from "./Landing";

const W = 440;
const H = 780;
/** Share of the window height the screen takes. */
const FILL = 0.88;

export const isRealPhone = () => window.matchMedia("(pointer: coarse) and (max-width: 500px)").matches;

/**
 * The page is always iPhone 16/17 Pro Max browser shape (440 wide, 780 visible). A real phone gets it
 * directly. Any other screen, at any window size, gets that same shape scaled to fit, touching the top
 * of the window. The page inside never reflows, so widening the window can never widen the site.
 */
export default function PhoneView() {
  const [mode, setMode] = useState<"unknown" | "phone" | "frame">("unknown");
  const [scale, setScale] = useState(1);
  const frame = useRef<HTMLIFrameElement>(null);

  useLayoutEffect(() => {
    const update = () => {
      setMode(isRealPhone() ? "phone" : "frame");
      setScale(Math.min(window.innerWidth / W, (window.innerHeight * FILL) / H));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scrolling beside the page still moves it.
  useEffect(() => {
    if (mode !== "frame") return;
    const onWheel = (e: WheelEvent) => frame.current?.contentWindow?.scrollBy({ top: e.deltaY });
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [mode]);

  if (mode === "unknown") return null;
  if (mode === "phone") return <Landing />;
  return (
    <div className="phone-stage">
      <iframe
        ref={frame}
        className="phone-frame"
        src="/site/"
        title="TakeX"
        allow="autoplay"
        width={W}
        height={H}
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  );
}
