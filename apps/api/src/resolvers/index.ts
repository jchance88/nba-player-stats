import { getPlayer, getPlayers, getSeasonAverages, getPlayerCareerStats } from "@nba/nba-client";

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
      try {
        const result = await getSeasonAverages(playerId, season);
        return result.data[0] ?? null;
      } catch {
        return null;
      }
    },
    playerStats: async (
      _: unknown,
      { firstName, lastName }: { firstName: string; lastName: string }
    ) => {
      try {
        return await getPlayerCareerStats(firstName, lastName);
      } catch {
        return null;
      }
    },
  },
};
