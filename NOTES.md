
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

Ok, I have a simple working version now. But, the API is per season, then races/results, and finally drivers. I want it the other way around, so let's give that a shot.

Hey, that looks pretty nice. Time for lunch :)

Actually, let's keep the extra relations, but just go by season and make the back-end more data-centric, and if we want the interface to start showing a list of drivers for the 2017 season than we can accomplish that client-side.

Remove mocking, replace with actual resolvers (but still example data)...

Now, with actual data from ergast. Synchronously fetch at startup, sue me ;-)

****** start client ***

npm install -g create-react-app
create-react-app client
cd client
npm start

Hmmm, this took a bit more time than expected, I started off with Apollo Client, but documentation and npm-install don't add up, probably because they just released a new version (2.0.0)? In any case, I dropped that for now, and started with fake data to get the interface working.

Now, add a touch of styling, then, hook up the graphql data.

Ok, we're going with minimal styling, that's cool ;-)

GraphQL data hooked up!
Everything seems to work fine, let's wrap this up for today :-)
Thanks for watching!


