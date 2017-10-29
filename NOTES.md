
Ok, let's build something.

Basic idea: show a list of F1 drivers for the 2017 season, select any (two?) drivers to view the statistics 'Qualifying Position', 'Race Position', 'Race Points' per round (race), and cumulative points/position over the season.

I've found http://ergast.com/mrd/ for F1 data, it has a JSON API that I could be using directly, but I want to try a GraphQL interface so I'll make a backend that does GraphQL and fetches the data from Ergast. I want a GraphiQL interface on this as well.

For the frontend I'll be using React, and asa stretch goal I'll see if I can produce some nice graphs from the statistics.

So, let's start with the back-end.

mkdir server
mkdir client
cd server

npm init
npm install express --save
npm install --save graphql apollo-server-express

create app.js with demo-code

npm install --save-dev babel-cli
npm install --save-dev babel-preset-es2015 babel-preset-stage-2

(to support import statement (and other es2016 features))

update package.json with start command

npm start

hey looky, http://localhost:3000/graphiql/ now gives an interface
...and an error since there's no schema yet ;-)

npm install --save-dev graphql-tools

ok, up and running!

next up, looking at the ergast api and defining a schema for millionf1.

GET https://ergast.com/api/f1/2017.json

no data yet? MRData.RaceTable.Races empty

MRData.total: "20"
MRData.RaceTable.Races [

.round "1"
.raceName "Australian Grand Prix"
.date "2017-03-26"
,...

]

GET https://ergast.com/api/f1/2017/1/results.json

no data yet? MRData.RaceTable.Races empty

MRData.RaceTable.Races[0]

.round "1"
.raceName "Australian Grand Prix"
.date "2017-03-26"
.Results [

.position "1"
.positionText "1"
.number "5"
.points "25"
.grid "2"
.laps "57"
.status "Finished"
.Driver
  .driverId "vettel"
  .code "VET"
  .givenName "Sebastian"
  .familyName "Vettel"
.Constructor
  .constructorId "ferrari"
  .name "Ferrari"
, ...
]

 The value of the positionText attribute is either an integer (finishing position), “R” (retired), “D” (disqualified), “E” (excluded), “W” (withdrawn), “F” (failed to qualify) or “N” (not classified).

Looks like that's enough data to get going.

How will our schema look?

Season
  .year "2017"
  .races [Race]

Race
  .round "1"
  .name "Australian Grand Prix"
  .date "2017-03-26"
  .results [RaceResult]

RaceResult
  .position "1"
  .number "5"
  .driver Driver
  .constructor Constructor
  .points "25"
  .status "1" (positionText)
  .statusText "Finished" (status)
  .laps "57"
  .grid "2"

Driver
  .id "vettel"
  .code "VET"
  .name "Vettel"
  .givenName "Sebastian"

Constructor
  .id "ferrari"
  .name "Ferrari"

Let's see how that translates to GraphQL.



