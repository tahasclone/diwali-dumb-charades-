"use client";

import { useEffect, type CSSProperties } from "react";
import { fireworkShow, stopFireworks } from "@/lib/fx";
import { sfx } from "@/lib/sound";
import { Diya } from "../Art";
import type { ScreenProps } from "../Game";

export default function Final({ state, update }: ScreenProps) {
  const ranked = state.teams.slice().sort((a, b) => b.score - a.score);
  const top = ranked[0]?.score ?? 0;
  const winners = ranked.filter((t) => t.score === top);

  useEffect(() => {
    sfx.win();
    fireworkShow(6);
    return stopFireworks;
  }, []);

  const rematch = () =>
    update((s) => ({ ...s, turn: 0, log: [], decks: {}, committed: true, teams: s.teams.map((t) => ({ ...t, score: 0 })), screen: "ready" }));
  const fresh = () => update((s) => ({ ...s, teams: [], turn: 0, log: [], committed: true, screen: "setup" }));

  return (
    <section className="screen">
      <Diya />
      <p className="eyebrow">{winners.length > 1 ? "It's a tie!" : "And the winner is"}</p>
      <h1 className="mega">{winners.map((w) => w.name).join(" & ")}</h1>
      <p className="lede">
        Shubh Deepavali! {top} point{top === 1 ? "" : "s"} takes the crown.
      </p>
      <div className="podium">
        {ranked.map((t, i) => (
          <div key={i} className={`place ${t.score === top ? "first" : ""}`} style={{ "--tc": t.color } as CSSProperties}>
            <span className="rk">{ranked.findIndex((x) => x.score === t.score) + 1}</span>
            <span className="nm">
              <b>{t.name}</b>
              <span>{t.members.join(", ")}</span>
            </span>
            <span className="n">{t.score}</span>
          </div>
        ))}
      </div>
      <div className="row center">
        <button className="btn btn-gold" onClick={rematch}>
          Rematch, same teams
        </button>
        <button className="btn btn-ghost" onClick={fresh}>
          New teams
        </button>
      </div>
    </section>
  );
}
