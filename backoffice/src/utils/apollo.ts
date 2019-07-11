import ApolloClient from 'apollo-boost'
import { GRAPHQL_URL } from './env'

export const apolloClient = new ApolloClient({
  uri: GRAPHQL_URL,
})
