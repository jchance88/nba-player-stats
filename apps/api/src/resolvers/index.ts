import { getPlayer, getPlayers, getSeasonAverages } from "@nba/nba-client";

export const resolvers = {
  Query: {
    players: async (_: unknown, { search, page = 1 }: { search?: string; page?: number }) => {
      const result = await getPlayers(search, page);
      return {
        data: result.data,
        next_cursor: result.meta.next_cursor ?? null,
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
