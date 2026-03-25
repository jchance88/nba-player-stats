import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { NBAPlayer } from "@nba/types";
import { ADD_FAVORITE, GET_FAVORITES, REMOVE_FAVORITE } from "../graphql/queries";
import PlayerStats from "./PlayerStats";

interface Props {
  player: NBAPlayer;
  expanded?: boolean;
  onExpand?: (id: number | null) => void;
}

export default function PlayerCard({ player, expanded, onExpand }: Props) {
  const { data: favData } = useQuery(GET_FAVORITES);
  const isFavorite = favData?.favoritePlayers?.some(
    (f: { playerId: number }) => f.playerId === player.id
  );

  const [addFavorite] = useMutation(ADD_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });
  const [removeFavorite] = useMutation(REMOVE_FAVORITE, {
    refetchQueries: [GET_FAVORITES],
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite({ variables: { playerId: player.id } });
    } else {
      addFavorite({ variables: { playerId: player.id } });
    }
  };

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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#888", fontSize: 13 }}>
            {player.team?.abbreviation ?? "FA"}
          </span>
          <button
            onClick={toggleFavorite}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "★" : "☆"}
          </button>
        </div>
      </div>
      {expanded && <PlayerStats playerId={player.id} />}
    </div>
  );
}
