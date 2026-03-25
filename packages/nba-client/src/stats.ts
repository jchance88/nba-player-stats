import https from "https";

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

export interface SeasonStat {
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

export interface CareerStats {
  career: SeasonStat | null;
  seasons: SeasonStat[];
}

function get<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https
      .get({ hostname: HOST, path, headers: HEADERS }, (res) => {
        let raw = "";
        res.on("data", (chunk: string) => (raw += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`stats.nba.com ${res.statusCode}: ${raw.slice(0, 120)}`));
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

function rowToStat(row: Record<string, any>, label?: string): SeasonStat {
  return {
    season: label ?? String(row.SEASON_ID ?? ""),
    team: row.TEAM_ABBREVIATION || "TOT",
    gp: row.GP ?? 0,
    min: typeof row.MIN === "number" ? row.MIN : parseFloat(row.MIN) || 0,
    pts: row.PTS ?? 0,
    reb: row.REB ?? 0,
    ast: row.AST ?? 0,
    stl: row.STL ?? 0,
    blk: row.BLK ?? 0,
    fg_pct: row.FG_PCT ?? null,
    fg3_pct: row.FG3_PCT ?? null,
    ft_pct: row.FT_PCT ?? null,
  };
}

// Cache: lowercase full name -> NBA stats player ID
let playerIdCache: Map<string, number> | null = null;

async function getPlayerIdMap(): Promise<Map<string, number>> {
  if (playerIdCache) return playerIdCache;
  const data = await get<any>(
    "/stats/commonallplayers?LeagueID=00&Season=2024-25&IsOnlyCurrentSeason=0"
  );
  const rs = data.resultSets.find((r: any) => r.name === "CommonAllPlayers");
  playerIdCache = new Map();
  if (rs) {
    for (const row of rs.rowSet) {
      const obj: Record<string, any> = {};
      rs.headers.forEach((h: string, i: number) => {
        obj[h] = row[i];
      });
      const name = ((obj.DISPLAY_FIRST_LAST as string) || "").toLowerCase().trim();
      if (name) playerIdCache.set(name, obj.PERSON_ID);
    }
  }
  return playerIdCache;
}

async function findNbaId(firstName: string, lastName: string): Promise<number | null> {
  const map = await getPlayerIdMap();
  const fullName = `${firstName} ${lastName}`.toLowerCase().trim();

  if (map.has(fullName)) return map.get(fullName)!;

  // Fallback: first entry whose display name contains both first and last name
  const first = firstName.toLowerCase();
  const last = lastName.toLowerCase();
  for (const [name, id] of map.entries()) {
    if (name.includes(first) && name.includes(last)) return id;
  }

  return null;
}

export async function getPlayerCareerStats(
  firstName: string,
  lastName: string
): Promise<CareerStats | null> {
  const nbaId = await findNbaId(firstName, lastName);
  if (!nbaId) return null;

  const data = await get<any>(
    `/stats/playercareerstats?PlayerID=${nbaId}&PerMode=PerGame`
  );

  const seasons = toRows(data.resultSets, "SeasonTotalsRegularSeason").map((r) =>
    rowToStat(r)
  );
  const careerRows = toRows(data.resultSets, "CareerTotalsRegularSeason");
  const career = careerRows.length ? rowToStat(careerRows[0], "Career") : null;

  return { career, seasons };
}
