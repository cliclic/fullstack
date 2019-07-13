import ApolloClient from 'apollo-boost'
import { GRAPHQL_PATH } from './env'
import {LocalCache} from "../components/common/consts";

export const apolloClient = new ApolloClient<LocalCache>({
  uri: GRAPHQL_PATH,
  credentials: 'include'
});
