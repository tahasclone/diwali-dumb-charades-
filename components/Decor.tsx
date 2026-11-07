/** Background layers from the invite: grain, spotlight, fairy lights, sparkles, and shared SVG symbols. */

const STRANDS: [number, number, number, number, number, number][] = [
  [-20, 18, 300, 70, 620, 16],
  [580, 16, 900, 74, 1220, 20],
  [-20, 60, 400, 108, 820, 58],
  [760, 60, 1000, 100, 1220, 52],
];

const SPARKLES: [number, number, number][] = [
  [6, 28, 34],
  [90, 18, 20],
  [84, 44, 40],
  [10, 72, 24],
  [94, 82, 22],
  [22, 90, 16],
  [70, 12, 14],
];

function FairyLights() {
  return (
    <svg id="lights" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true">
      {STRANDS.map(([x1, y1, cx, cy, x2, y2], si) => {
        const qy = cy * 2 - (y1 + y2) / 2;
        const bulbs = Array.from({ length: 13 }, (_, k) => {
          const i = k + 1;
          const t = i / 14;
          const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
          const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * qy + t * t * y2 + 3;
          return (
            <g key={i} className="bulb" style={{ animationDelay: `${(((i * 7 + si * 3) % 10) * 0.28).toFixed(2)}s` }}>
              <circle cx={x} cy={y} r={9} fill="rgba(255,236,170,.25)" />
              <circle cx={x} cy={y} r={3.6} fill="#fff6d8" />
            </g>
          );
        });
        return (
          <g key={si}>
            <path d={`M${x1} ${y1} Q${cx} ${qy} ${x2} ${y2}`} fill="none" stroke="rgba(255,240,200,.55)" strokeWidth={1.2} />
            {bulbs}
          </g>
        );
      })}
    </svg>
  );
}

function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <radialGradient id="g-flame" cx=".5" cy=".72" r=".62">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset=".45" stopColor="#ffd860" />
          <stop offset="1" stopColor="#ff8a1f" />
        </radialGradient>
        <radialGradient id="g-halo" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#ffe7a0" stopOpacity=".75" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="g-bowl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e08a3c" />
          <stop offset=".55" stopColor="#b8521c" />
          <stop offset="1" stopColor="#7c2f10" />
        </linearGradient>
        <symbol id="diya" viewBox="0 0 140 110">
          <circle cx="70" cy="34" r="34" fill="url(#g-halo)" />
          <path d="M70 4 C78 22 82 34 70 46 C58 34 62 22 70 4Z" fill="url(#g-flame)">
            <animateTransform attributeName="transform" type="scale" values="1 1;0.94 1.06;1.04 0.96;1 1" dur="1.4s" repeatCount="indefinite" additive="sum" />
            <animateTransform attributeName="transform" type="translate" values="0 0;4.2 -2.8;-2.8 1.8;0 0" dur="1.4s" repeatCount="indefinite" additive="sum" />
          </path>
          <path d="M8 54 Q70 46 132 54 Q122 104 70 104 Q18 104 8 54Z" fill="url(#g-bowl)" />
          <ellipse cx="70" cy="54" rx="62" ry="8" fill="#f2a65a" />
          <ellipse cx="70" cy="55" rx="54" ry="5" fill="#7a2c0e" />
          <g fill="#ffd27a">
            {[26, 36, 48, 60, 70, 80, 92, 104, 114].map((x, i) => (
              <circle key={x} cx={x} cy={[66, 70, 72, 73, 73, 73, 72, 70, 66][i]} r="2" />
            ))}
          </g>
          <g fill="none" stroke="#ffc86b" strokeWidth="2">
            <circle cx="50" cy="86" r="6" />
            <circle cx="70" cy="88" r="7" />
            <circle cx="90" cy="86" r="6" />
          </g>
          <g fill="#ffc86b">
            <circle cx="50" cy="86" r="2" />
            <circle cx="70" cy="88" r="2.4" />
            <circle cx="90" cy="86" r="2" />
          </g>
        </symbol>
        <symbol id="spk" viewBox="-12 -12 24 24">
          <path d="M0 -12 C1 -3 3 -1 12 0 C3 1 1 3 0 12 C-1 3 -3 1 -12 0 C-3 -1 -1 -3 0 -12Z" fill="currentColor" />
        </symbol>
      </defs>
    </svg>
  );
}

export default function Decor() {
  return (
    <>
      <div className="grain" />
      <div className="spot" />
      <FairyLights />
      <SvgDefs />
      {SPARKLES.map(([l, t, s], i) => (
        <svg
          key={i}
          className="sparkle"
          viewBox="-12 -12 24 24"
          aria-hidden="true"
          style={{ left: `${l}%`, top: `${t}%`, width: s, height: s, animationDelay: `${i * 0.6}s` }}
        >
          <use href="#spk" />
        </svg>
      ))}
    </>
  );
}
