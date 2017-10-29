import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

import './index.css';
import App from './App';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3001/graphql' }),
  cache: new InMemoryCache()
});

var season_gql = gql`query {
  season {
    year,
    races {
      round,
      name,
      results {
        position,
        number,
        driver {
          id,
          code,
          name,
          givenName,
        },
        points,
        grid,
      },
    },
  }
}`;
client.query({ query: season_gql }).then(console.log);

ReactDOM.render(<ApolloProvider client={client}><App /></ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
