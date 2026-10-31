export const SOUND_STATE = "takex:sound-state";


let ctx: AudioContext | null = null;
let output: AudioNode | null = null;
let loading = false;
let lastKey = -1;
const keys: AudioBuffer[] = [];
const KEY_COUNT = 8;
const PRESS_SECONDS = 0.07;

/** On at every page load. */
let enabled = true;

export function soundEnabled() {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  window.dispatchEvent(new Event(SOUND_STATE));
}

/** True while the browser is still holding audio back. */
export function soundBlocked() {
  return !ctx || ctx.state !== "running";
}

/** Browsers only allow audio after a visitor has clicked, tapped or pressed a key. */
export function unlockSound() {
  if (!ctx) {
    ctx = new AudioContext();
    ctx.onstatechange = () => window.dispatchEvent(new Event(SOUND_STATE));
  }
  if (ctx.state === "suspended") void ctx.resume();
  if (!output) {
    // Takes the top off the recording so it stays soft.
    const soft = ctx.createBiquadFilter();
    soft.type = "lowpass";
    soft.frequency.value = 4000;
    soft.Q.value = 0.5;
    const level = ctx.createGain();
    level.gain.value = 0.45;
    soft.connect(level).connect(ctx.destination);
    output = soft;
  }
}

/** Fetches the real keystroke recordings ahead of time, so the first letter has a sound ready. */
export function loadKeys() {
  unlockSound();
  if (loading) return;
  loading = true;
  for (let i = 1; i <= KEY_COUNT; i++) {
    fetch(`/keys/key-${i}.wav`)
      .then((r) => r.arrayBuffer())
      .then((data) => ctx!.decodeAudioData(data))
      .then((buffer) => keys.push(buffer))
      .catch(() => {});
  }
}

/** Plays one recorded keystroke, never the same one twice in a row, with a little natural variation. */
export function playKey() {
  if (!soundEnabled()) return;
  unlockSound();
  if (!ctx || ctx.state !== "running" || !keys.length) return;
  let pick = Math.floor(Math.random() * keys.length);
  if (pick === lastKey) pick = (pick + 1) % keys.length;
  lastKey = pick;
  const source = ctx.createBufferSource();
  source.buffer = keys[pick];
  source.playbackRate.value = 0.97 + Math.random() * 0.06;
  const gain = ctx.createGain();
  // Only the press itself: the recording's key-up click would read as a second letter.
  const at = ctx.currentTime;
  const level = 0.75 + Math.random() * 0.25;
  gain.gain.setValueAtTime(level, at);
  gain.gain.setValueAtTime(level, at + 0.035);
  gain.gain.linearRampToValueAtTime(0, at + PRESS_SECONDS);
  source.connect(gain).connect(output!);
  source.start(at, 0, PRESS_SECONDS);
}
