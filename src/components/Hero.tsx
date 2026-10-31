"use client";

import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "@/lib/gsap";
import { createOrb } from "@/lib/ambrose-orb";
import { links } from "@/content/site";
import { Button, Wordmark } from "./ui";

/**
 * A 300vh scroll stage. The wordmark's letters are windows onto the moving ember field; scrolling zooms
 * through the X of TakeX and opens onto Ambrose, the AI model behind it.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const orb = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const model = createOrb(orb.current!);
      const state = { form: reducedMotion() ? 1 : 0 };
      const onTick = () => {
        if (root.current!.getBoundingClientRect().bottom <= 0 || (state.form === 0 && !reducedMotion())) return;
        model.draw(state.form, performance.now());
      };
      gsap.ticker.add(onTick);
      if (reducedMotion()) return () => gsap.ticker.remove(onTick);

      const letters = q(".hero-whole [data-letter]");
      gsap.set(letters, { yPercent: 120, force3D: false });
      gsap.set(q(".hero-whole [data-mark]"), { scale: 0 });
      gsap.set(q("[data-fade]"), { autoAlpha: 0, y: 20 });

      const reveal = () => {
        gsap.to(gsap.utils.shuffle([...letters]), { yPercent: 0, duration: 1.6, ease: "power4.inOut", stagger: 0.08, delay: 0.1, force3D: false });
        gsap.to(q(".hero-whole [data-mark]"), { scale: 1, duration: 0.7, ease: "back.out(1.2)", delay: 1.3 });
        gsap.to(q("[data-fade]"), { autoAlpha: 1, y: 0, duration: 1.2, ease: "power4.out", stagger: 0.1, delay: 0.9 });
      };
      if ((window as unknown as { __takexReady?: boolean }).__takexReady) reveal();
      else window.addEventListener("takex:ready", reveal, { once: true });

      // Aim the zoom at the crossing of the X so the camera passes through the letter.
      const mark = q(".hero-mark")[0] as HTMLElement;
      const x = q("[data-x]")[0] as HTMLElement;
      const origin = () => {
        const m = mark.getBoundingClientRect();
        const r = x.parentElement!.getBoundingClientRect();
        return `${r.left - m.left + r.width / 2}px ${r.top - m.top + r.height * 0.56}px`;
      };

      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 1 } })
        .set(mark, { transformOrigin: origin }, 0)
        // force3D off: a GPU layer would scale a bitmap of the type and blur it.
        .to(mark, { scale: 26, ease: "power2.in", duration: 0.5, force3D: false }, 0)
        .to(q(".hero-whole"), { opacity: 0, duration: 0.14, ease: "none" }, 0.38)
        .to(q(".hero-overlay"), { opacity: 0, duration: 0.12 }, 0.08)
        .to(state, { form: 1, duration: 0.3, ease: "power2.out" }, 0.36)
        .fromTo(q(".hero-after > *"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.16, stagger: 0.04 }, 0.46)
        .to({}, { duration: 0.2 });

      return () => {
        gsap.ticker.remove(onTick);
        window.removeEventListener("takex:ready", reveal);
      };
    },
    { scope: root }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="hero-stick">
        <div className="field" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="hero-after">
          <div className="ai-stage" aria-hidden>
            <canvas ref={orb} />
          </div>
          <p className="h1-home ai-line">Investors decide in minutes and rarely tell you why.</p>
          <p className="h1-home ai-line is-ember">Ambrose does.</p>
        </div>
        <div className="hero-whole" aria-hidden>
          <div className="hero-sheet">
            <div className="hero-mark">
              <Wordmark markClass="is-window" />
            </div>
          </div>
        </div>
        <div className="hero-overlay">
          <div data-fade>
            <h1 className="p-l">
              See what an investor sees.
              <br />
              Before you pitch.
            </h1>
            <div className="hero-btns">
              <Button href={links.start}>Start free</Button>
              <Button href={links.investors} variant="line">
                Investor access
              </Button>
            </div>
          </div>
          <div data-fade className="hero-foot">
            <span className="p-s">The standard investors trust</span>
            <span className="p-s">Assessed by Ambrose AI</span>
          </div>
        </div>
      </div>
    </section>
  );
}
