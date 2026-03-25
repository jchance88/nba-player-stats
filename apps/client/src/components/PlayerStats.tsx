import { useQuery } from "@apollo/client";
import { GET_PLAYER_STATS } from "../graphql/queries";

interface SeasonStat {
  season: string;
  team: string;
  gp: number;
  min: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fg_pct: number | null;
  fg3_pct: number | null;
  ft_pct: number | null;
}

interface Props {
  firstName: string;
  lastName: string;
}

const pct = (v: number | null) => (v != null ? `${(v * 100).toFixed(1)}%` : "—");
const n = (v: number) => v?.toFixed(1) ?? "—";

const COLS: { label: string; key: keyof SeasonStat; format?: (v: any) => string }[] = [
  { label: "Season", key: "season" },
  { label: "Team", key: "team" },
  { label: "GP", key: "gp" },
  { label: "MIN", key: "min", format: n },
  { label: "PTS", key: "pts", format: n },
  { label: "REB", key: "reb", format: n },
  { label: "AST", key: "ast", format: n },
  { label: "STL", key: "stl", format: n },
  { label: "BLK", key: "blk", format: n },
  { label: "FG%", key: "fg_pct", format: pct },
  { label: "3P%", key: "fg3_pct", format: pct },
  { label: "FT%", key: "ft_pct", format: pct },
];

export default function PlayerStats({ firstName, lastName }: Props) {
  const { data, loading, error } = useQuery(GET_PLAYER_STATS, {
    variables: { firstName, lastName },
  });

  if (loading) return <p style={{ marginTop: 8, color: "#888" }}>Loading stats...</p>;
  if (error) return <p style={{ marginTop: 8, color: "red" }}>Failed to load stats.</p>;

  const stats = data?.playerStats;
  if (!stats || stats.seasons.length === 0)
    return <p style={{ marginTop: 8, color: "#888" }}>No stats available.</p>;

  const rows: (SeasonStat & { isCareer?: boolean })[] = [
    ...stats.seasons,
    ...(stats.career ? [{ ...stats.career, isCareer: true }] : []),
  ];

  return (
    <div style={{ marginTop: 14, overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ background: "#1d428a", color: "#fff" }}>
            {COLS.map((c) => (
              <th
                key={c.label}
                style={{ padding: "5px 8px", textAlign: c.label === "Season" || c.label === "Team" ? "left" : "right" }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.season + row.team + i}
              style={{
                background: row.isCareer
                  ? "#1d428a15"
                  : i % 2 === 0
                  ? "#f8f8f8"
                  : "#fff",
                fontWeight: row.isCareer ? 700 : 400,
              }}
            >
              {COLS.map((c) => {
                const val = row[c.key];
                const display = c.format ? c.format(val) : String(val ?? "—");
                return (
                  <td
                    key={c.label}
                    style={{
                      padding: "4px 8px",
                      textAlign:
                        c.label === "Season" || c.label === "Team" ? "left" : "right",
                    }}
                  >
                    {display}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
