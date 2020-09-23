import ApolloClient, { InMemoryCache } from 'apollo-boost';


export const client = new ApolloClient({
    uri: 'http://localhost:5433/graphql',
    cache: new InMemoryCache()
});
