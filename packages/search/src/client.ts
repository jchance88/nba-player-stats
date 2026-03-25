import { Client } from "@opensearch-project/opensearch";

export const opensearch = new Client({
  node: process.env.OPENSEARCH_NODE || "http://localhost:9200",
  ssl: { rejectUnauthorized: false },
});

export const PLAYERS_INDEX = "nba_players";
