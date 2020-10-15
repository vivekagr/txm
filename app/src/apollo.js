import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:5433/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      TransactionImport: {
        fields: {
          // when moving from TransactionImport detail page to list page, preserve the
          // transactions data (loaded on list page) by merging it
          transactions: {
            merge: true,
          }
        }
      },
      Query: {
        fields: {
          // pick out account object from cache that might have been there
          // when account list was loaded
          account(_, { args, toReference }) {
            return toReference({
              __typename: 'Account',
              id: args.id
            })
          }
        }
      }
    }
  }),
});
