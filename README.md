# millionf1
Formula 1 statistics viewer with a GraphQL back-end and a React front-end.

Start server
```
cd server
npm start
```

Now go to your browser and enter `http://localhost:3000/graphiql`.

Query:
```
{
  drivers {
    id,
    name,
    raceResults {
      race {
        season {
          year,
        },
        round,
        name,
      }
      position,
      points,
    }
  }
}
```
