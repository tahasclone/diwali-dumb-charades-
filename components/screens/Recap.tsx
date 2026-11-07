"use client";

import { useEffect, type CSSProperties } from "react";
import { actorAt, findWord, logPoints, points, teamAt, totalTurns, type LogEntry } from "@/lib/game";
import { burst } from "@/lib/fx";
import type { ScreenProps } from "../Game";

export default function Recap({ state, update, onNext }: ScreenProps & { onNext: () => void }) {
  const team = teamAt(state);
  const total = logPoints(state.log, state.settings);
  const indexed = state.log.map((x, i) => [x, i] as [LogEntry, number]);
  const got = indexed.filter(([x]) => x.got);
  const missed = indexed.filter(([x]) => !x.got);
  const last = state.turn + 1 >= totalTurns(state);
  const nextLabel = last
    ? "See the winner"
    : `Next: ${actorAt(state, state.turn + 1)} for ${teamAt(state, state.turn + 1).name}`;

  const toggle = (i: number) =>
    update((s) => ({ ...s, log: s.log.map((x, j) => (j === i ? { ...x, got: !x.got } : x)) }));

  useEffect(() => {
    if (total > 0) burst(innerWidth / 2, innerHeight * 0.28, 90);
    const onKey = (e: KeyboardEvent) => {
      // A focused button already handles Enter itself.
      if ((e.target as HTMLElement)?.tagName === "BUTTON") return;
      if (e.key === "Enter") {
        e.preventDefault();
        onNext();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext]);

  const Row = ({ x, i }: { x: LogEntry; i: number }) => {
    const w = findWord(x);
    return (
      <button type="button" className={`wrow ${x.got ? "" : "miss"}`} onClick={() => toggle(i)} title="Tap to switch between guessed and passed">
        <span className="e" aria-hidden="true">
          {w.em}
        </span>
        <span className="w">
          <b>{w.hi}</b>
          <span>
            {w.en} · L{w.lv}
          </span>
        </span>
        <span className="p">{x.got ? `+${points(w, state.settings)}` : "—"}</span>
      </button>
    );
  };

  return (
    <section className="screen">
      <p className="eyebrow">Time&apos;s up</p>
      <span className="teamtag" style={{ "--tc": team.color } as CSSProperties}>
        {team.name}
      </span>
      <div className="bigpts">+{total}</div>
      <p className="lede">
        {got.length} guessed, {missed.length} passed. Tap a word if it was marked wrong.
      </p>
      <div className="recap">
        <div className="list">
          <span className="label">Guessed</span>
          {got.length ? got.map(([x, i]) => <Row key={i} x={x} i={i} />) : <div className="empty">No words this time. Next turn!</div>}
        </div>
        <div className="list">
          <span className="label">Passed</span>
          {missed.length ? missed.map(([x, i]) => <Row key={i} x={x} i={i} />) : <div className="empty">No passes. Nice!</div>}
        </div>
      </div>
      <button className="btn btn-gold btn-big" onClick={onNext}>
        {nextLabel}
      </button>
      <span className="hint">
        or press <kbd>Enter</kbd>
      </span>
    </section>
  );
}
