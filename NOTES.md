
Ok, let's build something.

Basic idea: show a list of F1 drivers for the 2017 season, select any (two?) drivers to view the statistics 'Qualifying Position', 'Race Position', 'Race Points' per round (race), and cumulative points/position over the season.

I've found http://ergast.com/mrd/ for F1 data, it has a JSON API that I could be using directly, but I want to try a GraphQL interface so I'll make a backend that does GraphQL and fetches the data from Ergast. I want a GraphiQL interface on this as well.

For the frontend I'll be using React, and asa stretch goal I'll see if I can produce some nice graphs from the statistics.

So, let's start with the back-end.
