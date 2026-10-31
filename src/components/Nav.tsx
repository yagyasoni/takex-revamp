"use client";

import { useEffect, useRef, useState } from "react";
import { Butterfly } from "./ui";

/** A real bar with its own padding. It takes the colour of whichever section sits under it. */
export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const [light, setLight] = useState(true);

  useEffect(() => {
    const update = () => {
      const edge = bar.current?.offsetHeight ?? 0;
      let current: Element | null = null;
      document.querySelectorAll(".hero, .s-white, .s-black, .glitch").forEach((el) => {
        if (el.getBoundingClientRect().top <= edge) current = el;
      });
      const el = current as Element | null;
      if (!el || el.classList.contains("hero")) setLight(window.scrollY < window.innerHeight * 0.95);
      else setLight(el.classList.contains("s-white"));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav ref={bar} className={`nav ${light ? "is-light" : "is-dark"}`}>
      <a className="nav-brand" href="#top" aria-label="TakeX home">
        <Butterfly />
        TakeX
      </a>
      <span className="nav-menu">Menu</span>
    </nav>
  );
}
