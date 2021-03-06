import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'

import { authToken, errors } from './stores'

const httpLink = createHttpLink({
  uri: 'http://localhost:5433/graphql',
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = authToken.get()

  if (!token)
    return {
      headers,
    }

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  }
})

const errorHandlerLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    errors.add('An error occurred, please refresh the page & try again')
  } else if (networkError) {
    errors.add('Network error')
  }
})

const link = from([authLink, errorHandlerLink, httpLink])

const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    typePolicies: {
      TransactionImport: {
        fields: {
          // when moving from TransactionImport detail page to list page, preserve the
          // transactions data (loaded on list page) by merging it
          transactions: {
            merge: true,
          },
        },
      },
      Query: {
        fields: {
          // pick out account object from cache that might have been there
          // when account list was loaded
          account(_, { args, toReference }) {
            if (args && args.id)
              return toReference({
                __typename: 'Account',
                id: args.id,
              })
            return undefined
          },
        },
      },
    },
  }),
})

export default client
