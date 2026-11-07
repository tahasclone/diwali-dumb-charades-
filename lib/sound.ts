let ctx: AudioContext | null = null;
let enabled = true;

export const setSoundEnabled = (on: boolean) => {
  enabled = on;
};

function tone(freq: number, dur = 0.15, type: OscillatorType = "sine", vol = 0.18, delay = 0) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx || new AC();
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.02);
  } catch {
    /* audio unavailable */
  }
}

export const sfx = {
  got() {
    tone(880, 0.12, "triangle");
    tone(1320, 0.22, "triangle", 0.16, 0.08);
  },
  pass() {
    tone(300, 0.14, "sine", 0.12);
  },
  tick() {
    tone(1000, 0.05, "square", 0.06);
  },
  go() {
    tone(660, 0.12, "triangle");
    tone(990, 0.25, "triangle", 0.18, 0.12);
  },
  end() {
    tone(220, 0.6, "sawtooth", 0.12);
    tone(165, 0.8, "sawtooth", 0.1, 0.15);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.16, i * 0.14));
  },
};
