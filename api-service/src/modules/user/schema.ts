import {gql, makeExecutableSchema} from 'apollo-server';
import resolvers from './UserResolvers';

const typeDefs = gql`
    
enum Role {
    user
    admin
    super
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

input CreateUserInput {
    username: String!
    password: String!
    displayName: String
    roles: [Role]
}

input UpdateUserInput {
    username: String
    password: String
    displayName: String
    roles: [Role]
}

type Query {
    me: User!,
    users: [User]!
    user(id: ID): User!
}

type Mutation {
    createUser(input: CreateUserInput) : User
    updateUser(id: ID, input: UpdateUserInput) : User
    updateMe(input: UpdateUserInput) : User
    deleteUser(id: ID) : MutationResponse
}

`;

export default {
    typeDefs,
    resolvers
};
