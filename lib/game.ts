import { WORDS, type Level, type Word } from "./words";

export type Screen = "setup" | "teams" | "ready" | "play" | "recap" | "final";

export interface Settings {
  teams: number;
  seconds: number;
  turnsPerTeam: number;
  levels: Level[];
  /** Level 4 words score 2 points */
  bonus: boolean;
  /** Each round uses a harder level */
  ramp: boolean;
  sound: boolean;
}

export interface Team {
  name: string;
  color: string;
  members: string[];
  score: number;
}

/** A word as it was played in a turn (stored by reference so state stays small). */
export interface LogEntry {
  lv: Level;
  hi: string;
  got: boolean;
}

export type Decks = Partial<Record<Level, number[]>>;

export interface GameState {
  screen: Screen;
  settings: Settings;
  playersText: string;
  teams: Team[];
  turn: number;
  decks: Decks;
  log: LogEntry[];
  /** Whether the current turn's log has been added to the team's score */
  committed: boolean;
}

export const TEAM_PRESETS: [string, string][] = [
  ["Team Pataka", "#f2c75c"],
  ["Team Phuljhadi", "#7fe0ff"],
  ["Team Anaar", "#ff8f70"],
  ["Team Chakri", "#8ff0a4"],
  ["Team Rocket", "#ff9fd2"],
  ["Team Ladi", "#c9a8ff"],
  ["Team Bijli", "#fff07a"],
  ["Team Sutli Bomb", "#ffb36b"],
];

export const TIME_PRESETS = [30, 45, 60, 90, 120];

export const defaultState = (): GameState => ({
  screen: "setup",
  settings: { teams: 4, seconds: 60, turnsPerTeam: 3, levels: [1, 2, 3, 4], bonus: true, ramp: false, sound: true },
  playersText: "",
  teams: [],
  turn: 0,
  decks: {},
  log: [],
  committed: true,
});

export function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const parsePlayers = (text: string) =>
  text
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

export const points = (w: Pick<Word, "lv">, s: Settings) => (w.lv === 4 && s.bonus ? 2 : 1);

export const totalTurns = (s: GameState) => s.teams.length * s.settings.turnsPerTeam;
export const teamAt = (s: GameState, turn = s.turn) => s.teams[turn % s.teams.length];
export const roundAt = (s: GameState, turn = s.turn) => Math.floor(turn / s.teams.length);
export const actorAt = (s: GameState, turn = s.turn) => {
  const m = teamAt(s, turn).members;
  return m[roundAt(s, turn) % m.length];
};

export const findWord = (e: Pick<LogEntry, "lv" | "hi">): Word =>
  WORDS[e.lv].find((w) => w.hi === e.hi) ?? WORDS[e.lv][0];

export const logPoints = (log: LogEntry[], s: Settings) =>
  log.filter((x) => x.got).reduce((sum, x) => sum + points(x, s), 0);

/** Levels words may be drawn from on the current turn. */
export function allowedLevels(s: GameState): Level[] {
  const L = s.settings.levels.slice().sort();
  if (!s.settings.ramp || L.length < 2) return L;
  const R = s.settings.turnsPerTeam;
  const idx = Math.min(L.length - 1, Math.floor((roundAt(s) * L.length) / R));
  return [L[idx]];
}

/**
 * Draw a word without repeats until a level's deck runs out (then it reshuffles).
 * Mutates the given decks object, which the caller owns.
 */
export function drawWord(decks: Decks, levels: Level[]): Word {
  const deck = (lv: Level) => {
    if (!decks[lv] || decks[lv]!.length === 0) decks[lv] = shuffle(WORDS[lv].map((_, i) => i));
    return decks[lv]!;
  };
  const sizes = levels.map((lv) => deck(lv).length);
  let r = Math.random() * sizes.reduce((a, b) => a + b, 0);
  let lv = levels[0];
  for (let i = 0; i < levels.length; i++) {
    if (r < sizes[i]) {
      lv = levels[i];
      break;
    }
    r -= sizes[i];
  }
  return WORDS[lv][deck(lv).pop()!];
}

/** Randomly split players into teams; keeps any team names already chosen. */
export function makeTeams(players: string[], count: number, previous: Team[]): Team[] {
  const teams: Team[] = Array.from({ length: count }, (_, i) => ({
    name: previous[i]?.name || TEAM_PRESETS[i][0],
    color: TEAM_PRESETS[i][1],
    members: [],
    score: 0,
  }));
  shuffle(players).forEach((p, i) => teams[i % count].members.push(p));
  return shuffle(teams); // a random team goes first
}

export const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
