import { getPlayer, getPlayers, getSeasonAverages } from "@nba/nba-client";
import { prisma } from "@nba/db";
import { searchPlayers, ensureIndex, indexPlayer } from "@nba/search";
import { NBAPlayer } from "@nba/types";

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

    searchPlayers: async (_: unknown, { query }: { query: string }) => {
      await ensureIndex();
      const results = await searchPlayers(query);
      if (results.length === 0) {
        const apiResults = await getPlayers(query);
        for (const player of apiResults.data) {
          await indexPlayer(player);
        }
        return apiResults.data;
      }
      return results;
    },

    favoritePlayers: async () => {
      return prisma.favoritePlayer.findMany({ orderBy: { createdAt: "desc" } });
    },
  },

  Mutation: {
    addFavorite: async (_: unknown, { playerId }: { playerId: number }) => {
      const existing = await prisma.favoritePlayer.findUnique({ where: { playerId } });
      if (existing) return existing;
      const player: NBAPlayer = await getPlayer(playerId);
      await indexPlayer(player);
      return prisma.favoritePlayer.create({ data: { playerId } });
    },

    removeFavorite: async (_: unknown, { playerId }: { playerId: number }) => {
      await prisma.favoritePlayer.deleteMany({ where: { playerId } });
      return true;
    },
  },
};
