import { gql } from "@apollo/client";

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
      next_cursor
    }
  }
`;

export const GET_PLAYER_STATS = gql`
  query GetPlayerStats($firstName: String!, $lastName: String!) {
    playerStats(firstName: $firstName, lastName: $lastName) {
      season
      team
      gp
      min
      pts
      reb
      ast
      stl
      blk
      fg_pct
      fg3_pct
      ft_pct
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
