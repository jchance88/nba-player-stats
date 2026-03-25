import { useEffect, useRef, useState } from "react";
import { NBAPlayer } from "@nba/types";

interface Props {
  player: NBAPlayer;
  index?: number;
  expanded?: boolean;
  onExpand?: (id: number | null) => void;
}

export default function PlayerCard({ player, index = 0, expanded, onExpand }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = ["player-card", visible ? "visible" : "", expanded ? "expanded" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={classes}
      style={{
        border: "1px solid #dde3f0",
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        background: expanded ? "#f0f7ff" : "#fff",
        animationDelay: `${index * 55}ms`,
      }}
      onClick={() => onExpand?.(expanded ? null : player.id)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ fontSize: 15, color: "#1a1a2e" }}>
            {player.first_name} {player.last_name}
          </strong>
          <span style={{ marginLeft: 8, color: "#8a9bbf", fontSize: 13 }}>
            {player.position || "—"}
          </span>
        </div>
        <span
          style={{
            background: "#1d428a",
            color: "#fff",
            borderRadius: 6,
            padding: "2px 9px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {player.team?.abbreviation ?? "FA"}
        </span>
      </div>

      {expanded && player.team && (
        <div className="team-info" style={{ marginTop: 14, borderTop: "1px solid #dde3f0", paddingTop: 14 }}>
          <p style={{ margin: "0 0 12px", fontWeight: 700, color: "#1d428a", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Team Information
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
            {[
              { label: "Full Name", value: player.team.full_name },
              { label: "City", value: player.team.city },
              { label: "Abbreviation", value: player.team.abbreviation },
              { label: "Conference", value: player.team.conference },
              { label: "Division", value: player.team.division },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
