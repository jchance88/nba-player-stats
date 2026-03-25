import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Team {
    id: Int!
    abbreviation: String!
    city: String!
    conference: String!
    division: String!
    full_name: String!
    name: String!
  }

  type Player {
    id: Int!
    first_name: String!
    last_name: String!
    position: String!
    height_feet: Int
    height_inches: Int
    weight_pounds: Int
    team: Team
  }

  type SeasonAverage {
    games_played: Int!
    player_id: Int!
    season: Int!
    min: String!
    fgm: Float!
    fga: Float!
    fg3m: Float!
    fg3a: Float!
    ftm: Float!
    fta: Float!
    oreb: Float!
    dreb: Float!
    reb: Float!
    ast: Float!
    stl: Float!
    blk: Float!
    turnover: Float!
    pf: Float!
    pts: Float!
    fg_pct: Float!
    fg3_pct: Float!
    ft_pct: Float!
  }

  type FavoritePlayer {
    id: Int!
    playerId: Int!
    createdAt: String!
  }

  type PlayersPage {
    data: [Player!]!
    total_count: Int!
    total_pages: Int!
    current_page: Int!
  }

  type Query {
    players(search: String, page: Int): PlayersPage!
    player(id: Int!): Player
    seasonAverages(playerId: Int!, season: Int): SeasonAverage
    searchPlayers(query: String!): [Player!]!
    favoritePlayers: [FavoritePlayer!]!
  }

  type Mutation {
    addFavorite(playerId: Int!): FavoritePlayer!
    removeFavorite(playerId: Int!): Boolean!
  }
`;
