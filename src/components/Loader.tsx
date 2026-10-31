"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { dimensions } from "@/content/site";

function finish() {
  (window as unknown as { __takexReady?: boolean }).__takexReady = true;
  window.dispatchEvent(new Event("takex:ready"));
}

/** Counts through the 10 dimensions: the number and name roll up together, then the sheet lifts. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Every load starts from the top with the countdown.
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      if (reducedMotion()) {
        gsap.set(root.current, { display: "none" });
        finish();
        return;
      }
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline();
      const step = 0.62;
      dimensions.forEach((_, i) => {
        const at = 0.2 + i * step;
        tl.to(q(".count-col"), { yPercent: -(100 / dimensions.length) * i, duration: 0.45, ease: "power3.inOut" }, at);
        tl.to(q(".name-col"), { yPercent: -(100 / dimensions.length) * i, duration: 0.45, ease: "power3.inOut" }, at);
      });
      tl.fromTo(q(".loader-line b"), { scaleX: 0 }, { scaleX: 1, duration: 0.2 + dimensions.length * step, ease: "none" }, 0)
        .add(finish, "+=0.1")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<")
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div className="loader" ref={root} aria-hidden>
      <div className="loader-line">
        <b />
      </div>
      <div className="loader-names">
        <div className="name-col">
          {dimensions.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
      <div className="loader-count">
        <div className="count-clip">
          <div className="count-col">
            {dimensions.map((d, i) => (
              <span key={d}>{String(i + 1).padStart(2, "0")}</span>
            ))}
          </div>
        </div>
        <small>/ 10</small>
      </div>
    </div>
  );
}
