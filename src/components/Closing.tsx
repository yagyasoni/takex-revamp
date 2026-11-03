"use client";

import { useEffect, useRef, useState } from "react";
import { splitLetters } from "@/lib/letters";
import { loadKeys, playKey, setSoundEnabled, SOUND_STATE, soundBlocked, soundEnabled, unlockSound } from "@/lib/typing-sound";

function SoundToggle() {
  const [on, setOn] = useState(true);
  const blockedAtPress = useRef(false);

  useEffect(() => {
    const update = () => setOn(soundEnabled());
    update();
    window.addEventListener(SOUND_STATE, update);
    return () => window.removeEventListener(SOUND_STATE, update);
  }, []);

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      onPointerDown={() => {
        blockedAtPress.current = soundBlocked();
      }}
      onClick={() => {
        // While the browser is holding sound back, this press turns it on, never off.
        if (on && blockedAtPress.current) {
          blockedAtPress.current = false;
          unlockSound();
          return;
        }
        const next = !on;
        setOn(next);
        setSoundEnabled(next);
        if (next) unlockSound();
      }}
    >
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}

/** Both lines type themselves out with a key sound each time the section arrives. */
export default function Closing() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current!;
    const lines = [...section.querySelectorAll<HTMLElement>("[data-type]")].map(splitLetters);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The text cursor: holds still while typing and blinks whenever it waits.
    const caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");
    // Measured from the letter itself, so it is always on that letter's line with a clear gap.
    const place = (letter: HTMLElement, side: "before" | "after") => {
      const box = section.getBoundingClientRect();
      const r = letter.getBoundingClientRect();
      const size = parseFloat(getComputedStyle(letter).fontSize);
      const height = size * 0.92;
      caret.style.height = `${height}px`;
      caret.style.top = `${r.top - box.top + (r.height - height) / 2}px`;
      caret.style.left = `${(side === "after" ? r.right + size * 0.08 : r.left - size * 0.08) - box.left}px`;
    };
    const hide = () => {
      caret.remove();
      lines.flat().forEach((s) => (s.style.visibility = "hidden"));
    };
    hide();
    loadKeys();

    let timer = 0;
    let running = false;
    let startedSilent = false;
    let heard = false;
    const stop = () => {
      window.clearTimeout(timer);
      running = false;
    };
    const type = (line: number, i: number) => {
      const letters = lines[line];
      if (!letters) return;
      if (i >= letters.length) {
        caret.classList.add("is-idle");
        if (!lines[line + 1]) return;
        timer = window.setTimeout(() => type(line + 1, 0), 320);
        return;
      }
      caret.classList.remove("is-idle");
      const wordEnd = letters[i].nextSibling?.nodeType !== Node.ELEMENT_NODE;
      letters[i].style.visibility = "visible";
      place(letters[i], "after");
      if (playKey()) heard = true;
      // One sound per visible letter, at a natural pace: a beat between words, a longer one after a stop.
      const pause = /[.,]/.test(letters[i].textContent ?? "") ? 200 : wordEnd ? 50 : 0;
      timer = window.setTimeout(() => type(line, i + 1), 82 + Math.random() * 34 + pause);
    };

    const begin = () => {
      running = true;
      startedSilent = soundBlocked() || !soundEnabled();
      caret.classList.add("is-idle");
      section.appendChild(caret);
      place(lines[0][0], "before");
      timer = window.setTimeout(() => type(0, 0), 450);
    };
    // If sound is released while this section is showing, type it again so the visitor hears it.
    const onSoundState = () => {
      if (!running || !startedSilent || soundBlocked() || !soundEnabled()) return;
      stop();
      hide();
      begin();
    };
    window.addEventListener(SOUND_STATE, onSoundState);

    // Measured on every scroll, so leaving and returning are never missed.
    const check = () => {
      const r = section.getBoundingClientRect();
      const overlap = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (overlap <= 0) {
        if (running) {
          stop();
          hide();
        }
      } else if (overlap / r.height >= 0.6 && !running) {
        // On until the typing has actually been heard; off for every arrival after that unless switched back on.
        if (heard) setSoundEnabled(false);
        begin();
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    check();

    // Browsers hold audio back until the first click, tap or key press. On a desktop the site sits in a
    // phone-shaped frame, so a click on the page around the frame counts too.
    const unlock = () => {
      if (soundEnabled()) unlockSound();
    };
    const gestures = ["pointerdown", "pointerup", "click", "touchend", "keydown"];
    const targets: Window[] = [window];
    try {
      if (window.top && window.top !== window) targets.push(window.top);
    } catch {}
    targets.forEach((t) => gestures.forEach((g) => t.addEventListener(g, unlock)));
    return () => {
      stop();
      window.removeEventListener(SOUND_STATE, onSoundState);
      window.removeEventListener("scroll", check);
      targets.forEach((t) => gestures.forEach((g) => t.removeEventListener(g, unlock)));
    };
  }, []);

  return (
    <section className="s-white band full spread closing-band" ref={root}>
      <h2 className="h1-home" data-type>
        Investors make the first move. You decide.
      </h2>
      <p className="h3-style closing-sub" data-type>
        No cold <span className="is-ember">outreach</span>.
        <br />
        No <span className="is-ember">success</span> fees.
      </p>
      <SoundToggle />
    </section>
  );
}
