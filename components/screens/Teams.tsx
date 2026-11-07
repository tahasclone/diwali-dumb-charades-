"use client";

import type { CSSProperties } from "react";
import { makeTeams, ordinal, parsePlayers } from "@/lib/game";
import type { ScreenProps } from "../Game";

export default function Teams({ state, update, go }: ScreenProps) {
  const rename = (i: number, name: string) =>
    update((s) => ({ ...s, teams: s.teams.map((t, j) => (j === i ? { ...t, name } : t)) }));

  const reshuffle = () =>
    update((s) => ({ ...s, teams: makeTeams(parsePlayers(s.playersText), s.settings.teams, s.teams) }));

  const start = () =>
    update((s) => ({
      ...s,
      turn: 0,
      decks: {},
      log: [],
      committed: true,
      teams: s.teams.map((t) => ({ ...t, name: t.name.trim() || "Team", score: 0 })),
      screen: "ready",
    }));

  return (
    <section className="screen">
      <p className="eyebrow">The teams</p>
      <h2 className="h2">{state.teams.length} teams, ready to mime</h2>
      <p className="lede">Rename a team by tapping its name. Teams take turns in this order, and each player acts in turn.</p>
      <div className="teams">
        {state.teams.map((t, i) => (
          <div className="team" key={i} style={{ "--tc": t.color } as CSSProperties}>
            <input type="text" id={`team-${i}`} value={t.name} aria-label={`Team ${i + 1} name`} onChange={(e) => rename(i, e.target.value)} />
            <ol>
              {t.members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ol>
            <div className="meta">{i === 0 ? "Goes first" : `Plays ${ordinal(i + 1)}`}</div>
          </div>
        ))}
      </div>
      <div className="row center">
        <button className="btn btn-ghost" onClick={() => go("setup")}>
          Edit players
        </button>
        <button className="btn btn-ghost" onClick={reshuffle}>
          Shuffle again
        </button>
        <button className="btn btn-gold btn-big" onClick={start}>
          Start the game
        </button>
      </div>
    </section>
  );
}
