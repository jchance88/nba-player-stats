import { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { NBAPlayer } from "@nba/types";
import { GET_PLAYERS } from "../graphql/queries";
import SearchBar from "../components/SearchBar";
import PlayerCard from "../components/PlayerCard";

interface PlayersPage {
  data: NBAPlayer[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

export default function HomePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, { data, loading, error }] = useLazyQuery<{ players: PlayersPage }>(GET_PLAYERS);

  const handleSearch = (query: string) => {
    setExpandedId(null);
    search({ variables: { search: query, page: 1 } });
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ color: "#1d428a", marginBottom: 24 }}>NBA Player Stats</h1>
      <SearchBar onSearch={handleSearch} />

      {loading && <p style={{ marginTop: 16, color: "#888" }}>Searching...</p>}
      {error && <p style={{ marginTop: 16, color: "red" }}>Error: {error.message}</p>}

      {data && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {data.players.data.length === 0 ? (
            <p style={{ color: "#888" }}>No players found.</p>
          ) : (
            data.players.data.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                expanded={expandedId === player.id}
                onExpand={setExpandedId}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
