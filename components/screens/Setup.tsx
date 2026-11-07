"use client";

import { useState } from "react";
import { makeTeams, parsePlayers, TIME_PRESETS, totalTurns, type Settings } from "@/lib/game";
import { LEVELS, type Level } from "@/lib/words";
import { Dice, Diya } from "../Art";
import type { ScreenProps } from "../Game";

const timeLabel = (s: number) => (s < 60 ? `${s}s` : `${s / 60} min`);

export default function Setup({ state, update }: ScreenProps) {
  const st = state.settings;
  const [error, setError] = useState("");
  const [custom, setCustom] = useState(TIME_PRESETS.includes(st.seconds) ? "" : String(st.seconds));

  const set = (patch: Partial<Settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  const players = parsePlayers(state.playersText);
  const n = players.length;
  const inProgress = state.teams.length > 0 && state.turn > 0 && state.turn < totalTurns(state);

  const toggleLevel = (l: Level) => {
    if (st.levels.includes(l)) {
      if (st.levels.length > 1) set({ levels: st.levels.filter((x) => x !== l) });
    } else set({ levels: [...st.levels, l] });
  };

  const onMake = () => {
    if (n < st.teams) {
      setError(`You need at least ${st.teams} players for ${st.teams} teams. Add more names or lower the number of teams.`);
      return;
    }
    update((s) => ({ ...s, teams: makeTeams(players, s.settings.teams, s.teams), screen: "teams" }));
  };

  return (
    <section className="screen">
      <div className="hero">
        <Diya className="l" />
        <Diya className="r" />
        <p className="eyebrow">Happy Diwali</p>
        <h1 className="mega">Dumb Charades</h1>
        <p className="lede">
          100 Hindi and English words, from Naachna to Sapna. Add your players, we split the teams, and the actor reads each word
          from this screen.
        </p>
        <Dice />
      </div>

      {inProgress && (
        <div className="row center">
          <button className="btn btn-gold" onClick={() => update((s) => ({ ...s, screen: "ready" }))}>
            Resume game · turn {state.turn + 1} of {totalTurns(state)}
          </button>
        </div>
      )}

      <div className="setup-grid">
        <div className="panel field">
          <label className="label" htmlFor="players">
            Players · one per line, or separated by commas
          </label>
          <textarea
            id="players"
            value={state.playersText}
            placeholder={"Aarav\nDiya\nKabir\nMeera\nRohan\nSana\n…"}
            onChange={(e) => {
              setError("");
              const v = e.target.value;
              update((s) => ({ ...s, playersText: v }));
            }}
          />
          <div className="player-count">
            {n ? (
              <>
                <b>{n}</b> players → <b>{st.teams}</b> teams of {Math.floor(n / st.teams)}
                {n % st.teams ? `–${Math.ceil(n / st.teams)}` : ""}
              </>
            ) : (
              "Add at least one player per team"
            )}
          </div>
        </div>

        <div className="panel fields">
          <div className="field">
            <span className="label" id="lbl-teams">Number of teams</span>
            <Stepper labelId="lbl-teams" value={st.teams} min={2} max={8} onChange={(v) => set({ teams: v })} noun="teams" />
          </div>

          <div className="field">
            <span className="label">Time per turn</span>
            <div className="chips">
              {TIME_PRESETS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="chip"
                  aria-pressed={st.seconds === s}
                  onClick={() => {
                    setCustom("");
                    set({ seconds: s });
                  }}
                >
                  {timeLabel(s)}
                </button>
              ))}
              <input
                type="number"
                id="customSecs"
                min={10}
                max={600}
                step={5}
                placeholder="Custom s"
                aria-label="Custom seconds"
                style={{ width: 110, padding: "8px 12px", borderRadius: 999 }}
                value={custom}
                onChange={(e) => {
                  setCustom(e.target.value);
                  const v = Number(e.target.value);
                  if (v >= 10 && v <= 600) set({ seconds: v });
                }}
              />
            </div>
          </div>

          <div className="field">
            <span className="label" id="lbl-turns">Turns per team</span>
            <Stepper labelId="lbl-turns" value={st.turnsPerTeam} min={1} max={10} onChange={(v) => set({ turnsPerTeam: v })} noun="turns" />
          </div>

          <div className="field">
            <span className="label">Word levels</span>
            <div className="chips">
              {([1, 2, 3, 4] as Level[]).map((l) => (
                <button key={l} type="button" className="chip" aria-pressed={st.levels.includes(l)} title={LEVELS[l].blurb} onClick={() => toggleLevel(l)}>
                  L{l} <small>{LEVELS[l].name}</small>
                </button>
              ))}
            </div>
          </div>

          <label className="switch">
            <input type="checkbox" id="bonus" checked={st.bonus} onChange={(e) => set({ bonus: e.target.checked })} />
            <span>Level 4 words score 2 points</span>
          </label>
          <label className="switch">
            <input type="checkbox" id="ramp" checked={st.ramp} onChange={(e) => set({ ramp: e.target.checked })} />
            <span>
              Get harder each round
              <br />
              <span className="hint">Round 1 uses the easiest level you picked, the last round the hardest</span>
            </span>
          </label>
        </div>
      </div>

      {error && <div className="err" role="alert">{error}</div>}

      <div className="row center">
        <button className="btn btn-gold btn-big" onClick={onMake}>
          Make teams
        </button>
      </div>
    </section>
  );
}

function Stepper(props: { labelId: string; value: number; min: number; max: number; onChange: (v: number) => void; noun: string }) {
  const { labelId, value, min, max, onChange, noun } = props;
  return (
    <div className="stepper" role="group" aria-labelledby={labelId}>
      <button type="button" aria-label={`Fewer ${noun}`} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <output>{value}</output>
      <button type="button" aria-label={`More ${noun}`} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}
