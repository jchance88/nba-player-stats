import { useQuery } from "@apollo/client";
import { GET_SEASON_AVERAGES } from "../graphql/queries";

interface Props {
  playerId: number;
}

export default function PlayerStats({ playerId }: Props) {
  const { data, loading, error } = useQuery(GET_SEASON_AVERAGES, {
    variables: { playerId, season: 2023 },
  });

  if (loading) return <p style={{ marginTop: 8, color: "#888" }}>Loading stats...</p>;
  if (error) return <p style={{ marginTop: 8, color: "red" }}>Failed to load stats.</p>;

  const s = data?.seasonAverages;
  if (!s) return <p style={{ marginTop: 8, color: "#888" }}>No stats available.</p>;

  const stats: [string, string | number][] = [
    ["Season", s.season],
    ["GP", s.games_played],
    ["MIN", s.min],
    ["PTS", s.pts?.toFixed(1)],
    ["REB", s.reb?.toFixed(1)],
    ["AST", s.ast?.toFixed(1)],
    ["STL", s.stl?.toFixed(1)],
    ["BLK", s.blk?.toFixed(1)],
    ["TO", s.turnover?.toFixed(1)],
    ["FG%", s.fg_pct ? `${(s.fg_pct * 100).toFixed(1)}%` : "—"],
    ["3P%", s.fg3_pct ? `${(s.fg3_pct * 100).toFixed(1)}%` : "—"],
    ["FT%", s.ft_pct ? `${(s.ft_pct * 100).toFixed(1)}%` : "—"],
  ];

  return (
    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
      {stats.map(([label, val]) => (
        <div
          key={label}
          style={{
            background: "#e8f0fe",
            borderRadius: 4,
            padding: "4px 10px",
            textAlign: "center",
            minWidth: 48,
          }}
        >
          <div style={{ fontSize: 11, color: "#555" }}>{label}</div>
          <div style={{ fontWeight: 600 }}>{val}</div>
        </div>
      ))}
    </div>
  );
}
