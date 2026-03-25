import { NBAPlayer } from "@nba/types";
import { opensearch, PLAYERS_INDEX } from "./client";

export async function ensureIndex(): Promise<void> {
  const exists = await opensearch.indices.exists({ index: PLAYERS_INDEX });
  if (!exists.body) {
    await opensearch.indices.create({
      index: PLAYERS_INDEX,
      body: {
        mappings: {
          properties: {
            id: { type: "integer" },
            first_name: { type: "text" },
            last_name: { type: "text" },
            position: { type: "keyword" },
            team_name: { type: "text" },
            team_abbreviation: { type: "keyword" },
          },
        },
      },
    });
  }
}

export async function indexPlayer(player: NBAPlayer): Promise<void> {
  await opensearch.index({
    index: PLAYERS_INDEX,
    id: String(player.id),
    body: {
      id: player.id,
      first_name: player.first_name,
      last_name: player.last_name,
      position: player.position,
      team_name: player.team?.full_name,
      team_abbreviation: player.team?.abbreviation,
    },
    refresh: true,
  });
}

export async function searchPlayers(query: string): Promise<NBAPlayer[]> {
  const { body } = await opensearch.search({
    index: PLAYERS_INDEX,
    body: {
      query: {
        multi_match: {
          query,
          fields: ["first_name", "last_name", "team_name"],
          fuzziness: "AUTO",
        },
      },
      size: 20,
    },
  });

  return body.hits.hits.map((hit: { _source: NBAPlayer }) => hit._source);
}
