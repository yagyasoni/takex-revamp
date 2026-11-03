import { Howl, Howler } from "howler";

export const SOUND_STATE = "takex:sound-state";

/**
 * Real keystrokes: sixteen separate strikes on a Cherry KC 1000 office keyboard, recorded with a
 * Shure SM7B by unicaegames ("Keyboard Soundpack 1" on OpenGameArt, CC0). See public/keys/SOURCE.txt.
 * Played through Howler.js: exactly one recording per letter, at the instant the letter appears.
 */
const PACK = "/keys/office";
const TAKES = 16;

let keys: Howl[] = [];
let lastTake = -1;

/** On at every page load. */
let enabled = true;

export function soundEnabled() {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  window.dispatchEvent(new Event(SOUND_STATE));
}

function context(): AudioContext | null {
  return Howler.ctx ?? null;
}

/** True while the browser is still holding audio back. */
export function soundBlocked() {
  const ctx = context();
  return !ctx || ctx.state !== "running";
}

/** Browsers only allow audio after a visitor has clicked, tapped or pressed a key. */
export function unlockSound() {
  loadKeys();
  const ctx = context();
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

/** Fetches every recording ahead of time, so the first letter has a sound ready. */
export function loadKeys() {
  if (keys.length) return;
  // Howler's own unlock recreates its AudioContext (and drops every loaded sound) on devices
  // that run at 48 kHz, and its idle suspend would read as "blocked" here. Both are handled above.
  Howler.autoUnlock = false;
  Howler.autoSuspend = false;
  keys = Array.from({ length: TAKES }, (_, i) => new Howl({ src: [`${PACK}/key-${String(i + 1).padStart(2, "0")}.wav`] }));
  const ctx = context();
  if (ctx) ctx.onstatechange = () => window.dispatchEvent(new Event(SOUND_STATE));
}

/** Plays one real keystroke right now: a different strike each time, never the one just heard. */
export function playKey() {
  if (!soundEnabled()) return;
  unlockSound();
  if (!keys.length || soundBlocked()) return;
  let take = Math.floor(Math.random() * keys.length);
  if (take === lastTake) take = (take + 1) % keys.length;
  lastTake = take;
  const key = keys[take];
  // A recording that is still downloading would play late, out of step with its letter.
  if (key.state() !== "loaded") return;
  const id = key.play();
  key.rate(0.98 + Math.random() * 0.04, id);
  key.volume(0.9 + Math.random() * 0.1, id);
}
