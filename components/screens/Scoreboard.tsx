import type { CSSProperties } from "react";
import type { Team } from "@/lib/game";

export default function Scoreboard({ teams, current }: { teams: Team[]; current?: Team }) {
  return (
    <div className="board">
      {teams.map((t, i) => (
        <div key={i} className={`score ${t === current ? "now" : ""}`} style={{ "--tc": t.color } as CSSProperties}>
          <span className="t">
            <span className="dot" />
            {t.name}
          </span>
          <span className="n">{t.score}</span>
        </div>
      ))}
    </div>
  );
}
