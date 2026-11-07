"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { actorAt, allowedLevels, drawWord, points, teamAt, type Decks, type GameState, type LogEntry } from "@/lib/game";
import { CAT_COLORS, LEVELS, type Word } from "@/lib/words";
import { sfx } from "@/lib/sound";
import { burst } from "@/lib/fx";
import { Mandala } from "../Art";

const RING = 326.7; // circumference of the timer ring (r = 52)

export default function Play({ state, onEnd }: { state: GameState; onEnd: (log: LogEntry[], decks: Decks) => void }) {
  const team = teamAt(state);
  const actor = actorAt(state);
  const total = state.settings.seconds * 1000;

  const decks = useRef<Decks>(JSON.parse(JSON.stringify(state.decks)));
  const levels = useRef(allowedLevels(state)).current;
  const [word, setWord] = useState<Word>(() => drawWord(decks.current, levels));
  const [log, setLog] = useState<LogEntry[]>([]);
  const [lastGot, setLastGot] = useState<boolean | null>(null);
  const [cardKey, setCardKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [sec, setSec] = useState(state.settings.seconds);

  const logRef = useRef(log);
  logRef.current = log;
  const left = useRef(total);
  const done = useRef(false);
  const lastKey = useRef(0);
  const arcRef = useRef<SVGCircleElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    sfx.end();
    // The word still on screen when time runs out is not counted.
    onEnd(logRef.current, decks.current);
  }, [onEnd]);

  // Countdown, paused by unmounting the loop.
  useEffect(() => {
    if (paused) return;
    const endAt = performance.now() + left.current;
    let lastSec = -1;
    let raf = 0;
    const frame = () => {
      const l = Math.max(0, endAt - performance.now());
      left.current = l;
      arcRef.current?.setAttribute("stroke-dashoffset", (RING * (1 - l / total)).toFixed(1));
      const s = Math.ceil(l / 1000);
      if (s !== lastSec) {
        lastSec = s;
        setSec(s);
        if (s <= 5 && s > 0) sfx.tick();
      }
      if (l <= 0) return finish();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [paused, total, finish]);

  // Keep the screen awake while acting.
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    navigator.wakeLock?.request("screen").then((w) => (lock = w)).catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, []);

  const next = (got: boolean) => {
    if (paused || done.current) return;
    setLog((l) => [...l, { lv: word.lv, hi: word.hi, got }]);
    if (got) {
      sfx.got();
      const r = cardRef.current?.getBoundingClientRect();
      if (r) burst(r.left + r.width / 2, r.top + r.height * 0.35, 50);
    } else sfx.pass();
    setLastGot(got);
    setWord(drawWord(decks.current, levels));
    setCardKey((k) => k + 1);
  };

  const actions = useRef({ next, setPaused, finish });
  actions.current = { next, setPaused, finish };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === " " || k === "Spacebar") {
        e.preventDefault();
        if (e.repeat) return;
        const now = performance.now();
        if (now - lastKey.current < 250) return;
        lastKey.current = now;
        actions.current.next(true);
      } else if (k === "ArrowRight" || k === "s" || k === "S") {
        e.preventDefault();
        if (!e.repeat) actions.current.next(false);
      } else if (k === "p" || k === "P" || k === "Escape") {
        e.preventDefault();
        actions.current.setPaused((p) => !p);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === " ") e.preventDefault();
    };
    const onHide = () => {
      if (document.hidden) actions.current.setPaused(true);
    };
    addEventListener("keydown", onKey);
    addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("keyup", onKeyUp);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  const turnScore = log.filter((x) => x.got).reduce((a, x) => a + points(x, state.settings), 0);
  const noFocus = (e: React.MouseEvent) => e.preventDefault();
  const cc = CAT_COLORS[word.cat] ?? "#ffd27a";

  return (
    <section className="screen">
      <div className="playbar">
        <div className="who">
          <span className="teamtag" style={{ "--tc": team.color } as CSSProperties}>
            {team.name}
          </span>
          <b>{actor} is acting</b>
        </div>
        <button className="btn btn-ghost" style={{ padding: "10px 18px", fontSize: 15 }} onMouseDown={noFocus} onClick={() => setPaused(true)}>
          Pause <kbd>P</kbd>
        </button>
      </div>

      <div className="stage">
        <div>
          <div className={`timer ${sec <= 10 ? "low" : ""}`}>
            <svg viewBox="0 0 120 120">
              <circle className="track" cx="60" cy="60" r="52" fill="none" strokeWidth="9" />
              <circle ref={arcRef} className="arc" cx="60" cy="60" r="52" fill="none" strokeWidth="9" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset="0" />
            </svg>
            <div className="num">{sec}</div>
          </div>
          <div className="turnscore">
            This turn <b>{turnScore}</b>
          </div>
        </div>

        <div key={cardKey} ref={cardRef} className={`card ${lastGot ? "good" : "flip"}`} style={{ "--cc": cc } as CSSProperties}>
          <div className="tags">
            <span className="tag">{word.cat}</span>
            <span className="tag lv">
              Level {word.lv} · {LEVELS[word.lv].name}
            </span>
            {points(word, state.settings) > 1 && <span className="tag bonus">2 pts</span>}
          </div>
          <div className="medal">
            <div className="glow" />
            <Mandala />
            <div className="emo" aria-hidden="true">
              {word.em}
            </div>
          </div>
          <h2 className="word">{word.hi}</h2>
          <div className="deva" lang="hi">
            {word.dv}
          </div>
          <div className="eng">{word.en}</div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-pass" tabIndex={-1} onMouseDown={noFocus} onClick={() => next(false)}>
          Pass <kbd>→</kbd>
        </button>
        <button className="btn btn-got" tabIndex={-1} onMouseDown={noFocus} onClick={() => next(true)}>
          Got it! <kbd>Space</kbd>
        </button>
      </div>

      {paused && (
        <div className="overlay">
          <p className="eyebrow">Paused</p>
          <h2 className="h2">{Math.ceil(left.current / 1000)}s left</h2>
          <button className="btn btn-gold btn-big" autoFocus onClick={() => setPaused(false)}>
            Resume
          </button>
          <span className="hint">
            or press <kbd>P</kbd>
          </span>
          <button className="btn-link" onClick={finish}>
            End this turn now
          </button>
        </div>
      )}
    </section>
  );
}
