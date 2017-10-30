# millionf1
Formula 1 statistics viewer with a GraphQL back-end and a React front-end.

This uses data from http://ergast.com/mrd/, please refer to their terms if you want to do anything more than this demo-app.

Start server
```
cd server
npm start
```

Now go to your browser and enter `http://localhost:3001/graphiql`.

Query:
```
{
  season {
    year,
    races {
      round,
      name,
      results {
        position,
        number,
        driver {
          name,
          givenName,
        },
        points,
      },
    },
  }
}
```

![Formula 1 statistics viewer GraphiQL interface in action](http://www.million.nl/file/millionf1-graphiql.gif)


Start client dev
```
cd client
npm start
```

Go to `http://localhost:3000`.

![Formula 1 statistics viewer in action](http://www.million.nl/file/millionf1-client.gif)
