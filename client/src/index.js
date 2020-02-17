import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
// import { HttpLink } from 'apollo-link-http';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import moment from 'moment';
import MessageTypes from 'subscriptions-transport-ws/dist/message-types';

import App from './App';
import { signOut } from './components/SignOutButton/SignOutButton';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import { customFetch } from './utils/customFetch';

const httpLink = createUploadLink({
  uri: 'http://localhost:8000/graphql',
  fetch: customFetch,
});

// const httpLink = new HttpLink({
//   uri: 'http://localhost:8000/graphql',
// });

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8000/graphql`,
  options: {
    reconnect: true,
    lazy: true,
    inactivityTimeout: 1000,
    // connectionParams: () => {
    //   const token = localStorage.getItem('token');
    //   console.log('token ws', token);
    //   return {
    //     authToken: token ? token : '',
    //   };
    // },
    connectionCallback: err => {
      if (err) {
        console.log('Error Connecting to Subscriptions Server', err);
      }
    },
  },
});

// https://github.com/apollographql/apollo-link/issues/197
const subscriptionMiddleware = {
  applyMiddleware: (options, next) => {
    options.authToken = localStorage.getItem('token');
    next();
  },
};
wsLink.subscriptionClient.use([subscriptionMiddleware]);

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token = localStorage.getItem('token');
    // console.log('token http', token);

    if (token) {
      headers = { ...headers, 'x-token': token };
    }

    return { headers };
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log('My GraphQL error', message);
      signOut(client);

      if (message === 'UNAUTHENTICATED') {
        signOut(client);
      }
    });
  }

  if (networkError) {
    console.log('Network error', networkError);

    if (networkError.statusCode === 401) {
      signOut(client);
    }
  }
});

const link = ApolloLink.from([authLink, errorLink, terminatingLink]);

const cache = new InMemoryCache();

const client = new ApolloClient({
  link,
  cache,
  resolvers,
  typeDefs,
  dataIdFromObject: o => o.id,
});

const data = {
  autoplay: {
    __typename: 'Autoplay',
    direction: 'none',
    createdAt: moment().toISOString(),
    duration: 5,
  },
  theme: {
    __typename: 'Theme',
    type: 'light',
    color: 'orange',
  },
  refetchFollowers: {
    __typename: 'Int',
    signal: 0,
  },
  messagesVariables: {
    __typename: 'MessagesVariables',
    username: null,
    cursor: null,
    limit: 2,
  },
};

cache.writeData({ data });
client.onResetStore(() => cache.writeData({ data }));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
