"use client";

import { useEffect, useRef, useState } from "react";
import { reads } from "@/content/site";

const STEP_MS = 2500;

/** One small looping picture per thing Ambrose tells you. */
function Visual({ kind }: { kind: string }) {
  if (kind === "gauge")
    return (
      <div className="v-gauge">
        <svg viewBox="0 0 200 108">
          <path className="track" pathLength={100} d="M12 100a88 88 0 0 1 176 0" />
          <path className="fill" pathLength={100} d="M12 100a88 88 0 0 1 176 0" />
          <g className="needle">
            <polygon points="97,100 100,28 103,100" />
          </g>
          <circle className="hub" cx="100" cy="100" r="7" />
          <circle className="hub-dot" cx="100" cy="100" r="2.5" />
        </svg>
        <div className="v-gauge-label">
          <span>Readiness</span>
          <b>High Readiness</b>
        </div>
      </div>
    );
  if (kind === "gaps")
    return (
      <div className="v-gaps">
        {Array.from({ length: 40 }, (_, i) => (
          <i key={i} className={[6, 17, 23, 34].includes(i) ? "is-flag" : ""} />
        ))}
      </div>
    );
  if (kind === "bars")
    return (
      <div className="v-bars">
        {[46, 88, 58, 100, 70, 94].map((h, i) => (
          <i key={i} className={h > 85 ? "is-top" : ""} style={{ "--h": `${h}%`, "--i": i } as React.CSSProperties} />
        ))}
      </div>
    );
  if (kind === "track")
    return (
      <div className="v-track">
        <b />
        <div>
          <span>Builder</span>
          <span>Emerging</span>
          <span>Execution-Ready</span>
        </div>
      </div>
    );
  return (
    <ol className="v-order">
      {["Fix first", "Then this", "Then this"].map((t, i) => (
        <li key={i} style={{ "--i": i } as React.CSSProperties}>
          <b>{i + 1}</b>
          {t}
        </li>
      ))}
    </ol>
  );
}

/** Plays through the reads like stories while on screen. Tapping a segment jumps to it. */
export default function AmbroseStories() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  // Each arrival starts the screen fresh, so its animation plays while it can be seen.
  const [run, setRun] = useState(0);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setRun((n) => n + 1);
      },
      { threshold: 0.8 }
    );
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % reads.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [active, visible]);

  const r = reads[active];
  return (
    <div className="stories" ref={root} data-r>
      <div className="story" key={`${run}-${active}`}>
        <div className="story-visual" aria-hidden>
          {visible && <Visual kind={r.visual} />}
        </div>
        <div className="story-clip">
          <h3>{r.title}</h3>
        </div>
        <p>{r.body}</p>
      </div>
      <div className="story-tabs">
        {reads.map((x, i) => (
          <button
            type="button"
            key={x.tag}
            aria-label={x.title}
            aria-current={i === active}
            className={i === active && visible ? "is-playing" : i < active ? "is-done" : ""}
            onClick={() => setActive(i)}
          >
            <span>{x.tag}</span>
            <i>
              <b key={i === active ? `${run}-${active}` : "x"} style={{ animationDuration: `${STEP_MS}ms` }} />
            </i>
          </button>
        ))}
      </div>
    </div>
  );
}
