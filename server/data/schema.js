
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { find, filter } from 'lodash';
import fetch from './fetch';

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
  race: [Race]!
  position: Int!
  number: Int!
  driver: Driver!
  constructor: Constructor!
  points: Int!
  status: String! # (positionText)
  statusText: String! # (status)
  laps: Int!
  grid: Int!
}

type Driver {
  id: String! # driverId
  code: String!
  name: String! # familyName
  givenName: String!
  raceResults: [RaceResult]!
}

type Constructor {
  id: String! # constructorId
  name: String!
  raceResults: [RaceResult]!
}

type Query {
  season: Season # 2017 only, perhaps later we can filter on year
}
`;


const data = fetch();


const resolvers = {
  Query: {
    season: () => data.season,
  },
  Season: {
    races: (season) => filter(data.races, { season: season }),
  },
  Race: {
    results: (race) => filter(data.raceresults, { race: race }),
  },
};


const schema = makeExecutableSchema({ typeDefs, resolvers, });

export default schema;
