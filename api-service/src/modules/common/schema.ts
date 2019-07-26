import {gql} from 'apollo-server';

const typeDefs = gql`

scalar DateTime

type MutationResponse {
    success: Boolean!
}
`;

export default {
    typeDefs
};
