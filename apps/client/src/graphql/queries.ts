import { gql } from "@apollo/client";

export const SEARCH_PLAYERS = gql`
  query SearchPlayers($query: String!) {
    searchPlayers(query: $query) {
      id
      first_name
      last_name
      position
      team {
        full_name
        abbreviation
      }
    }
  }
`;

export const GET_PLAYERS = gql`
  query GetPlayers($search: String, $page: Int) {
    players(search: $search, page: $page) {
      data {
        id
        first_name
        last_name
        position
        height_feet
        height_inches
        weight_pounds
        team {
          id
          full_name
          abbreviation
          city
          conference
          division
        }
      }
      total_count
      total_pages
      current_page
    }
  }
`;

export const GET_SEASON_AVERAGES = gql`
  query GetSeasonAverages($playerId: Int!, $season: Int) {
    seasonAverages(playerId: $playerId, season: $season) {
      games_played
      season
      min
      pts
      reb
      ast
      stl
      blk
      turnover
      fg_pct
      fg3_pct
      ft_pct
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites {
    favoritePlayers {
      id
      playerId
      createdAt
    }
  }
`;

export const ADD_FAVORITE = gql`
  mutation AddFavorite($playerId: Int!) {
    addFavorite(playerId: $playerId) {
      id
      playerId
    }
  }
`;

export const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($playerId: Int!) {
    removeFavorite(playerId: $playerId)
  }
`;
