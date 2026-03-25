import https from "https";
import { NBAPlayer, PlayersResponse, SeasonAverage } from "@nba/types";
import { SeasonStat } from "./stats";

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
          if (res.statusCode === 401 || res.statusCode === 403) {
            return reject(new Error(`balldontlie API error ${res.statusCode}: ${raw.trim()}`));
          }
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

export async function getPlayerSeasonStats(
  firstName: string,
  lastName: string
): Promise<SeasonStat[]> {
  const result = await getPlayers(`${firstName} ${lastName}`);
  const player = result.data[0];
  if (!player) return [];

  const currentYear = new Date().getFullYear();
  const seasons = Array.from({ length: 8 }, (_, i) => currentYear - 1 - i);

  const results = await Promise.all(
    seasons.map((season) =>
      getSeasonAverages(player.id, season)
        .then((r) => (r.data[0] ? { avg: r.data[0], season } : null))
        .catch(() => null)
    )
  );

  const seasonStats: SeasonStat[] = results
    .filter((r): r is { avg: SeasonAverage; season: number } => r !== null)
    .map(({ avg, season }) => ({
      season: String(season),
      team: "—",
      gp: avg.games_played,
      min: parseFloat(avg.min) || 0,
      pts: avg.pts,
      reb: avg.reb,
      ast: avg.ast,
      stl: avg.stl,
      blk: avg.blk,
      fg_pct: avg.fg_pct,
      fg3_pct: avg.fg3_pct,
      ft_pct: avg.ft_pct,
    }));

  return seasonStats;
}
