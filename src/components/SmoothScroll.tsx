"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { splitLetters } from "@/lib/letters";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Nowhere's two entrances, each played once: letters appear in sequence, blocks fade up.
    gsap.utils.toArray<HTMLElement>("[data-letters]").forEach((el) => {
      const letters = splitLetters(el);
      gsap.set(letters, { opacity: 0 });
      gsap.to(letters, { opacity: 1, duration: 0.3, stagger: 0.025, ease: "none", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
    });
    gsap.utils.toArray<HTMLElement>("[data-r]").forEach((el) => {
      gsap.from(el, { y: 20, autoAlpha: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Whenever scrolling stops, settle so one full screen is showing, never half of two sections.
    // A section taller than the screen (hero, butterfly) has two stops: its start and its end.
    const stops = () => {
      const vh = window.innerHeight;
      const out: number[] = [];
      document.querySelectorAll("main > section, footer").forEach((el) => {
        const r = el.getBoundingClientRect();
        const top = Math.round(r.top + window.scrollY);
        out.push(top);
        if (r.height > vh + 2) out.push(Math.round(top + r.height - vh));
      });
      return out;
    };
    let anchor = 0;
    let settling = false;
    let touching = false;
    let idle = 0;
    const settle = () => {
      if (touching) return;
      const y = window.scrollY;
      const list = stops();
      const vh = window.innerHeight;
      let target = anchor;
      if (Math.abs(y - anchor) > vh * 0.06) {
        const ahead = y > anchor ? list.filter((p) => p >= y - 1) : list.filter((p) => p <= y + 1).reverse();
        target = ahead[0] ?? anchor;
      }
      anchor = target;
      if (Math.abs(target - y) < 2) return;
      settling = true;
      lenis.scrollTo(target, {
        duration: Math.min(1.4, Math.max(0.6, (Math.abs(target - y) / vh) * 0.8)),
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        onComplete: () => {
          settling = false;
        },
      });
    };
    const onScroll = () => {
      window.clearTimeout(idle);
      if (!settling) idle = window.setTimeout(settle, 130);
    };
    const onInput = () => {
      settling = false;
    };
    const onTouchStart = () => {
      touching = true;
      settling = false;
      window.clearTimeout(idle);
    };
    const onTouchEnd = () => {
      touching = false;
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
