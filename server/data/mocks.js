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
