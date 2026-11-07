"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultState, logPoints, teamAt, totalTurns, type GameState, type LogEntry, type Decks, type Screen } from "@/lib/game";
import { setSoundEnabled } from "@/lib/sound";
import Setup from "./screens/Setup";
import Teams from "./screens/Teams";
import Ready from "./screens/Ready";
import Play from "./screens/Play";
import Recap from "./screens/Recap";
import Final from "./screens/Final";

export type Update = (fn: (s: GameState) => GameState) => void;
export interface ScreenProps {
  state: GameState;
  update: Update;
  go: (screen: Screen) => void;
}

const STORAGE_KEY = "diwali-charades-v1";

function load(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const s: GameState = { ...defaultState(), ...JSON.parse(raw) };
    if (!s.teams.length && s.screen !== "setup") s.screen = "setup";
    if (s.screen === "play") s.screen = "ready"; // a reload mid-turn restarts that turn
    return s;
  } catch {
    return defaultState();
  }
}

export default function Game() {
  const [state, setState] = useState<GameState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable: the game still works for this session */
    }
  }, [state, loaded]);

  useEffect(() => {
    setSoundEnabled(state.settings.sound);
  }, [state.settings.sound]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state.screen]);

  const update: Update = useCallback((fn) => setState(fn), []);
  const go = useCallback((screen: Screen) => setState((s) => ({ ...s, screen })), []);

  const toggleSound = useCallback(
    () => setState((s) => ({ ...s, settings: { ...s.settings, sound: !s.settings.sound } })),
    [],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (e.key === "m" || e.key === "M") toggleSound();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [toggleSound]);

  const endTurn = useCallback(
    (log: LogEntry[], decks: Decks) => setState((s) => ({ ...s, log, decks, committed: false, screen: "recap" })),
    [],
  );

  const nextTurn = useCallback(
    () =>
      setState((s) => {
        let teams = s.teams;
        if (!s.committed) {
          const i = s.turn % s.teams.length;
          const add = logPoints(s.log, s.settings);
          teams = s.teams.map((t, j) => (j === i ? { ...t, score: t.score + add } : t));
        }
        const turn = s.turn + 1;
        return { ...s, teams, turn, log: [], committed: true, screen: turn >= totalTurns(s) ? "final" : "ready" };
      }),
    [],
  );

  if (!loaded) return <main className="app" />;

  const props: ScreenProps = { state, update, go };
  const hasTeam = state.teams.length > 0 && !!teamAt(state);

  return (
    <>
      <div className="topctl">
        <button
          className="icon-btn"
          type="button"
          onClick={toggleSound}
          aria-label={state.settings.sound ? "Sound on" : "Sound off"}
          title="Sound (M)"
        >
          {state.settings.sound ? "🔊" : "🔇"}
        </button>
      </div>
      <main className="app" aria-live="polite">
        {state.screen === "setup" && <Setup {...props} />}
        {state.screen === "teams" && <Teams {...props} />}
        {state.screen === "ready" && hasTeam && <Ready {...props} />}
        {state.screen === "play" && hasTeam && <Play state={state} onEnd={endTurn} />}
        {state.screen === "recap" && hasTeam && <Recap {...props} onNext={nextTurn} />}
        {state.screen === "final" && <Final {...props} />}
      </main>
    </>
  );
}
