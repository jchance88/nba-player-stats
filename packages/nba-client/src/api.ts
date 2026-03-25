import https from "https";
import { NBAPlayer, PlayersResponse, SeasonAverage } from "@nba/types";

const HOST = "api.balldontlie.io";

function get<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      path: `/v1${path}`,
      headers: {
        Accept: "application/json",
        Authorization: process.env.BALLDONTLIE_API_KEY ?? "",
      },
    };
    https
      .get(options, (res) => {
        let raw = "";
        res.on("data", (chunk: string) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

export async function getPlayers(
  search?: string,
  page = 1
): Promise<PlayersResponse> {
  const params = new URLSearchParams({ per_page: "25", page: String(page) });
  if (search) params.set("search", search);
  return get<PlayersResponse>(`/players?${params}`);
}

export async function getPlayer(id: number): Promise<NBAPlayer> {
  return get<NBAPlayer>(`/players/${id}`);
}

export async function getSeasonAverages(
  playerId: number,
  season = 2023
): Promise<{ data: SeasonAverage[] }> {
  return get<{ data: SeasonAverage[] }>(
    `/season_averages?player_ids[]=${playerId}&season=${season}`
  );
}
