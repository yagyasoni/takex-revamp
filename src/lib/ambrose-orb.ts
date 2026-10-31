type Point = { x: number; y: number; z: number; links: number[] };
type Signal = { from: number; to: number; at: number; speed: number };

const COUNT = 340;
const LINKS = 3;
const SIGNALS = 26;
const TILT = 0.38;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Ambrose drawn as a living model: a rotating 3D mesh of points whose surface breathes in slow waves,
 * with signals travelling along its links. `form` (0 to 1) gathers it out of scattered points.
 */
export function createOrb(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.max(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;

  // Even points on a sphere, each linked to its nearest neighbours.
  const points: Point[] = Array.from({ length: COUNT }, (_, i) => {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(a) * r, y, z: Math.sin(a) * r, links: [] };
  });
  points.forEach((p, i) => {
    p.links = points
      .map((q, j) => ({ j, d: (p.x - q.x) ** 2 + (p.y - q.y) ** 2 + (p.z - q.z) ** 2 }))
      .filter((n) => n.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, LINKS)
      .map((n) => n.j);
  });

  const newSignal = (at = 0): Signal => {
    const from = Math.floor(Math.random() * COUNT);
    return { from, to: points[from].links[Math.floor(Math.random() * LINKS)], at, speed: 0.012 + Math.random() * 0.02 };
  };
  const signals = Array.from({ length: SIGNALS }, () => newSignal(Math.random()));

  const resize = () => {
    const box = canvas.getBoundingClientRect();
    if (box.width === w && box.height === h) return;
    w = box.width;
    h = box.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  };

  const draw = (form: number, now: number) => {
    resize();
    if (!w || !h) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    const R = Math.min(w, h) * 0.44;
    const cx = w / 2;
    const cy = h / 2;
    const spin = t * 0.22;
    const cs = Math.cos(spin);
    const sn = Math.sin(spin);
    const ct = Math.cos(TILT);
    const st = Math.sin(TILT);
    const scatter = 1 + (1 - form) * 1.5;

    const project = (p: Point) => {
      const wave = 1 + Math.sin(p.y * 4 + t * 1.3) * 0.045 + Math.sin(p.x * 5 - t * 0.9) * 0.03;
      const k = wave * scatter;
      const x = (p.x * cs + p.z * sn) * k;
      const z0 = (-p.x * sn + p.z * cs) * k;
      const y = (p.y * ct - z0 * st) * k;
      // Scatter can push a point past the sphere, so depth stays in range for perspective and shading.
      const z = Math.max(-1, Math.min(1, p.y * st + z0 * ct));
      const persp = 2.6 / (2.6 - z);
      return { x: cx + x * R * persp, y: cy + y * R * persp, z };
    };
    const at = points.map(project);

    // Soft core light behind the mesh.
    const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.05);
    core.addColorStop(0, `rgba(255,107,53,${0.5 * form})`);
    core.addColorStop(0.55, `rgba(255,107,53,${0.14 * form})`);
    core.addColorStop(1, "rgba(255,107,53,0)");
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 0.6;
    points.forEach((p, i) => {
      const a = at[i];
      const depth = (a.z + 1) / 2;
      for (const j of p.links) {
        if (j < i) continue;
        ctx.strokeStyle = `rgba(255,255,255,${(0.05 + depth * 0.28) * form})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(at[j].x, at[j].y);
        ctx.stroke();
      }
    });
    points.forEach((_, i) => {
      const a = at[i];
      const depth = (a.z + 1) / 2;
      ctx.fillStyle = `rgba(255,255,255,${clamp(0.18 + depth * 0.82) * clamp(form * 1.5)})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 0.6 + depth * 1.1, 0, Math.PI * 2);
      ctx.fill();
    });

    signals.forEach((s, i) => {
      const a = at[s.from];
      const b = at[s.to];
      ctx.fillStyle = `rgba(255,176,143,${form})`;
      ctx.beginPath();
      ctx.arc(a.x + (b.x - a.x) * s.at, a.y + (b.y - a.y) * s.at, 2, 0, Math.PI * 2);
      ctx.fill();
      s.at += s.speed;
      if (s.at < 1) return;
      // Most signals carry on to a neighbour, so they trace paths across the mesh.
      if (Math.random() < 0.8) {
        s.from = s.to;
        s.to = points[s.from].links[Math.floor(Math.random() * LINKS)];
        s.at = 0;
      } else signals[i] = newSignal();
    });
  };

  return { draw };
}
