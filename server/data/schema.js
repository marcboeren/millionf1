
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import mocks from './mocks'

const typeDefs = `
type Season {
  year: String!
  races: [Race]!
}

type Race {
  season: Season!
  round: Int!
  name: String!
  date: String!
  results: [RaceResult]!
}

type RaceResult {
  position: Int!
  number: Int!
  driver: Driver!
  constructor: Constructor!
  points: Int!
  status: String! # (positionText)
  statusText: String! # (status)
  laps: Int!
  grid: Int!
  race: [Race]!
}

type Driver {
  id: String! # driverId
  code: String!
  name: String! # familyName
  givenName: String!
  raceResults: [RaceResult]! # just for the current season, ordered by round
}

type Constructor {
  id: String! # constructorId
  name: String!
  raceResults: [RaceResult]! # just for the current season, ordered by round
}

type Query {
  drivers: [Driver]
}
`;

const schema = makeExecutableSchema({ typeDefs });

addMockFunctionsToSchema({ schema, mocks });

export default schema;
