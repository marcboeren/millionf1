const mocks = {
  Season: () => ({
    year: "2017",
  }),
  Race: () => ({
    round: 1,
    name: "Australian Grand Prix",
    date: "2017-03-26",
  }),
  RaceResult: () => ({
    position: 1,
    number: 5,
    points: 25,
    status: "1",
    statusText: "Finished",
    laps: 57,
    grid: 2,
  }),
  Driver: () => ({
    id: "5",
    code: "VET",
    name: "Vettel",
    givenName: "Sebastian",
  }),
  Constructor: () => ({
    id: "ferrari",
    name: "Ferrari",
  }),
};

export default mocks;

/*

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


*/