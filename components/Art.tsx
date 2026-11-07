/** Small illustrations reused across screens. */

export function Diya({ className = "" }: { className?: string }) {
  return (
    <svg className={`diya ${className}`} viewBox="0 0 140 110" aria-hidden="true">
      <use href="#diya" />
    </svg>
  );
}

export function Dice() {
  return (
    <svg className="dice" viewBox="0 0 120 120" aria-hidden="true">
      <rect x="10" y="10" width="100" height="100" rx="20" fill="#fbf6ea" />
      <path d="M110 30 L110 90 Q110 110 90 110 L30 110 Q50 100 70 100 Q100 100 110 30Z" fill="#7a1e4c" opacity=".85" />
      <g fill="#111">
        <circle cx="35" cy="35" r="8" />
        <circle cx="85" cy="35" r="8" />
        <circle cx="60" cy="60" r="8" />
        <circle cx="35" cy="85" r="8" />
        <circle cx="85" cy="85" r="8" />
      </g>
    </svg>
  );
}

/** Rangoli-style ring that slowly turns behind each word's illustration. */
export function Mandala() {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <ellipse key={`p${i}`} cx="0" cy="-80" rx="5" ry="13" transform={`rotate(${i * 15})`} fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".75" />
      ))}
      {Array.from({ length: 48 }, (_, i) => {
        const a = (i * 7.5 * Math.PI) / 180;
        return <circle key={`d${i}`} cx={(94 * Math.cos(a)).toFixed(1)} cy={(94 * Math.sin(a)).toFixed(1)} r="1.8" fill="currentColor" />;
      })}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={`l${i}`} d="M0 -62 Q8 -70 0 -78 Q-8 -70 0 -62Z" transform={`rotate(${i * 30 + 15})`} fill="currentColor" opacity=".55" />
      ))}
      <circle r="64" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 5" />
      <circle r="98" fill="none" stroke="currentColor" strokeWidth="1" opacity=".5" />
    </svg>
  );
}
