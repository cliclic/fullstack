import {gql, makeExecutableSchema} from 'apollo-server';
import resolvers from './UserResolvers';

const typeDefs = gql`
scalar DateTime

enum Role {
    User
    Admin
}

type AccessToken {
    token: String!
    createdAt: DateTime!
}

type User {
    _id: ID!
    username: String!
    displayName: String!
    roles: [Role!]!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Query {
    me: User!,
    users: [User]!
}

type Mutation {
    createUser(username: String!, password: String!, displayName: String!, roles: [Role!]!) : User
    updateUser(id: String!, username: String, password: String, displayName: String, roles: [Role]) : User
    updateMe(username: String, password: String, displayName: String, roles: [Role]) : User
}
`;

export default makeExecutableSchema({
    typeDefs,
    resolvers
});
