"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { actorAt, allowedLevels, roundAt, teamAt, totalTurns } from "@/lib/game";
import { sfx } from "@/lib/sound";
import { Diya } from "../Art";
import Scoreboard from "./Scoreboard";
import type { ScreenProps } from "../Game";

export default function Ready({ state, update, go }: ScreenProps) {
  const team = teamAt(state);
  const actor = actorAt(state);
  const round = roundAt(state);
  const [count, setCount] = useState<number | null>(null);
  const counting = useRef(false);

  const startCountIn = () => {
    if (counting.current) return;
    counting.current = true;
    setCount(3);
  };

  useEffect(() => {
    if (count === null) return;
    if (count === 0) {
      sfx.go();
      go("play");
      return;
    }
    sfx.tick();
    const id = setTimeout(() => setCount(count - 1), 800);
    return () => clearTimeout(id);
  }, [count, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "BUTTON") return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startCountIn();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  /** Let a different team member act this turn by moving the current actor to the back of the line. */
  const skipActor = () =>
    update((s) => {
      const i = s.turn % s.teams.length;
      const teams = s.teams.map((t, j) => {
        if (j !== i) return t;
        const m = t.members.slice();
        m.push(m.splice(roundAt(s) % m.length, 1)[0]);
        return { ...t, members: m };
      });
      return { ...s, teams };
    });

  return (
    <section className="screen">
      <div className="turnline">
        <span className="pill">
          Round {round + 1} of {state.settings.turnsPerTeam}
        </span>
        <span className="pill">
          Turn {state.turn + 1} of {totalTurns(state)}
        </span>
        <span className="pill">
          {state.settings.seconds}s · L{allowedLevels(state).join(", L")}
        </span>
      </div>
      <span className="teamtag" style={{ "--tc": team.color } as CSSProperties}>
        {team.name}
      </span>
      <p className="eyebrow">Now acting</p>
      <h1 className="actor">{actor}</h1>
      <p className="lede">
        Hand the screen to {actor}. Only the actor looks! Press <kbd>Space</kbd> each time {team.name} guesses right, and{" "}
        <kbd>→</kbd> to pass.
      </p>
      <Diya />
      <button className="btn btn-gold btn-big" onClick={startCountIn} onMouseDown={(e) => e.preventDefault()}>
        Start the timer
      </button>
      <span className="hint">
        or press <kbd>Enter</kbd>
      </span>
      <Scoreboard teams={state.teams} current={team} />
      <div className="row center">
        {team.members.length > 1 && (
          <button className="btn-link" onClick={skipActor}>
            Someone else acts
          </button>
        )}
        <button className="btn-link" onClick={() => go("final")}>
          End game now
        </button>
        <button className="btn-link" onClick={() => update((s) => ({ ...s, teams: [], turn: 0, log: [], screen: "setup" }))}>
          New game
        </button>
      </div>

      {count !== null && count > 0 && (
        <div className="overlay">
          <div className="countin" key={count}>
            {count}
          </div>
          <div className="label">{actor}, get ready</div>
        </div>
      )}
    </section>
  );
}
