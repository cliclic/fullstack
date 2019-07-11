import ApolloClient from 'apollo-boost'
import { SERVER_URL } from './env'

export const apolloClient = new ApolloClient({
  uri: SERVER_URL,
})
