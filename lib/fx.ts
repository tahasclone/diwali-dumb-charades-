/** Tiny particle system for sparkle bursts and the winner's fireworks. */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  c: string;
  r: number;
}

let canvas: HTMLCanvasElement | null = null;
let c2d: CanvasRenderingContext2D | null = null;
let parts: Particle[] = [];
let running = false;
let showTimer: ReturnType<typeof setInterval> | undefined;

const COLORS = ["#f2c75c", "#fff6d8", "#ff8f70", "#7fe0ff", "#8ff0a4"];

export function attachCanvas(el: HTMLCanvasElement | null) {
  canvas = el;
  c2d = el?.getContext("2d") ?? null;
  resize();
}

export function resize() {
  if (!canvas || !c2d) return;
  const d = window.devicePixelRatio || 1;
  canvas.width = innerWidth * d;
  canvas.height = innerHeight * d;
  c2d.setTransform(d, 0, 0, d, 0, 0);
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function burst(x: number, y: number, n = 60) {
  if (!c2d || reducedMotion()) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const v = 2 + Math.random() * 5;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c: COLORS[i % COLORS.length], r: 1.5 + Math.random() * 2.2 });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(step);
  }
}

function step() {
  if (!c2d) return;
  c2d.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0);
  for (const p of parts) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.vx *= 0.985;
    p.life -= 0.014;
    c2d.globalAlpha = Math.max(p.life, 0);
    c2d.fillStyle = p.c;
    c2d.beginPath();
    c2d.arc(p.x, p.y, p.r, 0, 7);
    c2d.fill();
  }
  c2d.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(step);
  else {
    running = false;
    c2d.clearRect(0, 0, innerWidth, innerHeight);
  }
}

export function fireworkShow(seconds = 6) {
  clearInterval(showTimer);
  let k = 0;
  showTimer = setInterval(() => {
    burst(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.12 + Math.random() * 0.4), 80);
    if (++k > seconds * 2.5) clearInterval(showTimer);
  }, 400);
}

export function stopFireworks() {
  clearInterval(showTimer);
}
