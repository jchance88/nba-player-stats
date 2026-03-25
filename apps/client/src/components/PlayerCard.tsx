import { NBAPlayer } from "@nba/types";
import PlayerStats from "./PlayerStats";

interface Props {
  player: NBAPlayer;
  expanded?: boolean;
  onExpand?: (id: number | null) => void;
}

export default function PlayerCard({ player, expanded, onExpand }: Props) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        cursor: "pointer",
        background: expanded ? "#f0f7ff" : "#fff",
      }}
      onClick={() => onExpand?.(expanded ? null : player.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong>
            {player.first_name} {player.last_name}
          </strong>
          <span style={{ marginLeft: 8, color: "#666" }}>{player.position || "—"}</span>
        </div>
        <span style={{ color: "#888", fontSize: 13 }}>
          {player.team?.abbreviation ?? "FA"}
        </span>
      </div>
      {expanded && <PlayerStats playerId={player.id} />}
    </div>
  );
}
