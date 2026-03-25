import { getPlayer, getPlayers, getSeasonAverages } from "@nba/nba-client";

export const resolvers = {
  Query: {
    players: async (_: unknown, { search, page = 1 }: { search?: string; page?: number }) => {
      const result = await getPlayers(search, page);
      return {
        data: result.data,
        total_count: result.meta.total_count,
        total_pages: result.meta.total_pages,
        current_page: result.meta.current_page,
      };
    },

    player: async (_: unknown, { id }: { id: number }) => {
      return getPlayer(id);
    },

    seasonAverages: async (
      _: unknown,
      { playerId, season = 2023 }: { playerId: number; season?: number }
    ) => {
      const result = await getSeasonAverages(playerId, season);
      return result.data[0] ?? null;
    },
  },
};
