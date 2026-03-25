import https from "https";
import { NBAPlayer, NBATeam, PlayersResponse, SeasonAverage } from "@nba/types";

const HOST = "stats.nba.com";

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://www.nba.com/",
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "x-nba-stats-origin": "stats",
  "x-nba-stats-token": "true",
  Origin: "https://www.nba.com",
};

function get<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get({ hostname: HOST, path, headers: HEADERS }, (res) => {
        let raw = "";
        res.on("data", (chunk: string) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            reject(new Error(`Non-JSON response from ${HOST}${path}: ${raw.slice(0, 120)}`));
          }
        });
      })
      .on("error", reject);
  });
}

function toRows(resultSets: any[], name: string): Record<string, any>[] {
  const rs = resultSets.find((r: any) => r.name === name);
  if (!rs || !rs.rowSet.length) return [];
  return rs.rowSet.map((row: any[]) => {
    const obj: Record<string, any> = {};
    rs.headers.forEach((h: string, i: number) => {
      obj[h] = row[i];
    });
    return obj;
  });
}

function rowToPlayerSummary(row: Record<string, any>): NBAPlayer {
  const nameParts = ((row.DISPLAY_FIRST_LAST as string) || "").split(" ");
  const team: NBATeam = {
    id: row.TEAM_ID ?? 0,
    abbreviation: row.TEAM_ABBREVIATION || "",
    city: row.TEAM_CITY || "",
    conference: "",
    division: "",
    full_name: `${row.TEAM_CITY || ""} ${row.TEAM_NAME || ""}`.trim(),
    name: row.TEAM_NAME || "",
  };
  return {
    id: row.PERSON_ID,
    first_name: nameParts[0] || "",
    last_name: nameParts.slice(1).join(" ") || "",
    position: "",
    height_feet: null,
    height_inches: null,
    weight_pounds: null,
    team,
  };
}

let playerCache: NBAPlayer[] | null = null;

async function getAllPlayers(): Promise<NBAPlayer[]> {
  if (playerCache) return playerCache;
  const data = await get<any>(
    "/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1"
  );
  playerCache = toRows(data.resultSets, "CommonAllPlayers").map(rowToPlayerSummary);
  return playerCache;
}

export async function getPlayers(search?: string, page = 1): Promise<PlayersResponse> {
  const all = await getAllPlayers();
  const filtered = search
    ? all.filter((p) =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase())
      )
    : all;
  const per_page = 25;
  const total = filtered.length;
  const start = (page - 1) * per_page;
  return {
    data: filtered.slice(start, start + per_page),
    meta: {
      total_count: total,
      total_pages: Math.ceil(total / per_page),
      current_page: page,
      next_page: start + per_page < total ? page + 1 : null,
      per_page,
    },
  };
}

export async function getPlayer(id: number): Promise<NBAPlayer> {
  const data = await get<any>(`/stats/commonplayerinfo?PlayerID=${id}`);
  const rows = toRows(data.resultSets, "CommonPlayerInfo");
  const r = rows[0];
  const [hFeet, hInches] = (r.HEIGHT || "").split("-").map(Number);
  return {
    id: r.PERSON_ID,
    first_name: r.FIRST_NAME || "",
    last_name: r.LAST_NAME || "",
    position: r.POSITION || "",
    height_feet: hFeet || null,
    height_inches: hInches || null,
    weight_pounds: r.WEIGHT ? Number(r.WEIGHT) : null,
    team: {
      id: r.TEAM_ID ?? 0,
      abbreviation: r.TEAM_ABBREVIATION || "",
      city: r.TEAM_CITY || "",
      conference: "",
      division: "",
      full_name: `${r.TEAM_CITY || ""} ${r.TEAM_NAME || ""}`.trim(),
      name: r.TEAM_NAME || "",
    },
  };
}

export async function getSeasonAverages(
  playerId: number,
  season = 2023
): Promise<{ data: SeasonAverage[] }> {
  const seasonStr = `${season}-${String(season + 1).slice(2)}`;
  const data = await get<any>(
    `/stats/playercareerstats?PlayerID=${playerId}&PerMode=PerGame`
  );
  const rows = toRows(data.resultSets, "SeasonTotalsRegularSeason");
  const row = rows.find((r) => r.SEASON_ID === seasonStr);
  if (!row) return { data: [] };
  return {
    data: [
      {
        games_played: row.GP,
        player_id: playerId,
        season,
        min: String(row.MIN ?? "0"),
        fgm: row.FGM ?? 0,
        fga: row.FGA ?? 0,
        fg3m: row.FG3M ?? 0,
        fg3a: row.FG3A ?? 0,
        ftm: row.FTM ?? 0,
        fta: row.FTA ?? 0,
        oreb: row.OREB ?? 0,
        dreb: row.DREB ?? 0,
        reb: row.REB ?? 0,
        ast: row.AST ?? 0,
        stl: row.STL ?? 0,
        blk: row.BLK ?? 0,
        turnover: row.TOV ?? 0,
        pf: row.PF ?? 0,
        pts: row.PTS ?? 0,
        fg_pct: row.FG_PCT ?? 0,
        fg3_pct: row.FG3_PCT ?? 0,
        ft_pct: row.FT_PCT ?? 0,
      },
    ],
  };
}
