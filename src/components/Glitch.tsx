"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { splitChars } from "@/lib/scramble";
import { glitch } from "@/content/site";
import { Butterfly } from "./ui";

/** How many times the line repeats in each scattered block. */
const GLITCH_LINES = 4;

const POSITIONS = ["g-a", "g-b", "g-c", "g-d", "", "g-e"];

/**
 * After Nowhere's section: a line scattered across a sticky screen. The letters
 * fall away as the section scrolls, while the final statement stays in the empty band. Two small cards drift up from the bottom.
 */
export default function Glitch() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;
      const section = root.current!;
      const blocks = [...section.querySelectorAll<HTMLElement>("[data-glitch]")];
      const splitBlocks = blocks.map((b) => splitChars(b));
      const all = splitBlocks.flat();
      const finalChars = splitChars(section.querySelector<HTMLElement>("[data-final]")!);
      // The final line sits in the empty band and writes itself once as the section arrives, then stays.
      gsap.set(finalChars.map(({ span }) => span), { opacity: 0 });
      gsap.to(finalChars.map(({ span }) => span), {
        opacity: 1,
        duration: 0.25,
        stagger: 0.035,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top 40%", once: true },
      });

      const fall = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "center 30%",
          scrub: 2,
        },
      });
      splitBlocks.forEach((chars, bi) => {
        chars.forEach(({ span }) => {
          fall.to(
            span,
            {
              y: gsap.utils.random(10, 24),
              x: gsap.utils.random(-10, 10),
              rotation: gsap.utils.random(-20, 20),
              opacity: 0,
              ease: "power2.in",
              duration: gsap.utils.random(0.25, 0.7),
            },
            bi * 0.06 + gsap.utils.random(0, 0.6)
          );
        });
      });

      const q = gsap.utils.selector(section);
      gsap.to(q("[data-big]"), { opacity: 0.08, ease: "none", immediateRender: false, scrollTrigger: { trigger: section, start: "top top", end: "center center", scrub: 2 } });
      // The cards finish rising as the section reaches its last stop, then travel with the page, and
      // their height is capped so they always stop below the final line.
      const stick = (q(".glitch-stick")[0] as HTMLElement).getBoundingClientRect();
      const lineBottom = (q("[data-final]")[0] as HTMLElement).getBoundingClientRect().bottom - stick.top;
      const rise = (card: HTMLElement) => Math.max(0, window.innerHeight - card.offsetHeight - 16 - lineBottom - 24);
      const cardTrigger = { trigger: section, start: "top top", end: "bottom bottom", invalidateOnRefresh: true };
      gsap.fromTo(q("[data-par-1]"), { y: 100 }, { y: () => -Math.min(rise(q("[data-par-1]")[0] as HTMLElement), 60), ease: "none", scrollTrigger: { ...cardTrigger, scrub: 1.5 } });
      gsap.fromTo(q("[data-par-2]"), { y: 100 }, { y: () => -rise(q("[data-par-2]")[0] as HTMLElement), ease: "none", scrollTrigger: { ...cardTrigger, scrub: 2 } });

    },
    { scope: root }
  );

  const line = Array.from({ length: GLITCH_LINES }, (_, i) => (
    <span key={i}>
      {glitch.line}
      {i < GLITCH_LINES - 1 && <br />}
    </span>
  ));

  return (
    <section ref={root} className="glitch">
      <div data-big className="glitch-big" aria-hidden>
        <Butterfly />
      </div>
      <div className="glitch-layer">
        <div className="glitch-stick">
          {POSITIONS.map((pos, i) => (
            <div key={i} className="glitch-cell">
              {pos && (
                <div data-glitch className={`glitch-block ${pos}`}>
                  {line}
                </div>
              )}
            </div>
          ))}
          <div data-final className="glitch-final">
            {glitch.final.map((l, i) => (
              <span key={i}>
                {l}
                {i < glitch.final.length - 1 && <br />}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="glitch-cards">
        <div data-par-1 className="g-card">
          <span className="label-mono">Signal Report</span>
          <span className="h3-style">Your strongest dimension, and your weakest.</span>
        </div>
        <div data-par-2 className="g-card is-ember">
          <span className="label-mono">COR™</span>
          <Butterfly className="is-window" />
          <span className="label-mono">Issued</span>
        </div>
      </div>
    </section>
  );
}
