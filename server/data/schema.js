
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { find, filter } from 'lodash';

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


// example data
const drivers = [
  { id: "vettel", code: "VET", name: "Vettel", givenName: "Sebastian" },
  { id: "hamilton", code: "HAM", name: "Hamilton", givenName: "Lewis" },
  { id: "max_verstappen", code: "VER", name: "Verstappen", givenName: "Max" },
];
const constructors = [
  { id: "ferrari", name: "Ferrari" },
  { id: "mercedes", name: "Mercedes" },
  { id: "red_bull", name: "Red Bull" },
];
const season = { year: "2017", races: [] };
const races = [
  { season: season, round: 1, name: "Australian Grand Prix", date: "2017-03-26" },
];
const raceresults = [
  { race: races[0], position: 1, number:  5, driver: drivers[0], constructor: constructors[0], points: 25, status: "1", statusText: "Finished", laps: 57, grid: 2 },
  { race: races[0], position: 2, number: 44, driver: drivers[1], constructor: constructors[1], points: 18, status: "2", statusText: "Finished", laps: 57, grid: 1 },
  { race: races[0], position: 5, number: 33, driver: drivers[2], constructor: constructors[2], points: 10, status: "5", statusText: "Finished", laps: 57, grid: 5 },
];


const resolvers = {
  Query: {
    season: () => season,
  },
  Season: {
    races: (season) => filter(races, { season: season }),
  },
  Race: {
    results: (race) => filter(raceresults, { race: race }),
  },
};


const schema = makeExecutableSchema({ typeDefs, resolvers, });

export default schema;
