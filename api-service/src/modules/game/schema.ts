import {gql} from 'apollo-server';
import resolvers from './GameResolver';

const typeDefs = gql`
type GameLot {
    _id: ID!
    title: String!
    text: String!
    winnerShot: GameShot
}

type GameLotPool {
    _id: ID!
    lots: [GameLot!]!
}

type Game {
    _id: ID!
    completed: Boolean!
    startAt: DateTime!
    endAt: DateTime!
    title: String!
    currentLot: GameLot!
    lotPool: GameLotPool!
    winningDelay: Int
    createdAt: DateTime!
}

type GameShot {
    _id: ID!
    game: Game!
    player: GamePlayer!
    message: String!
    isWinner: Boolean!
    createdAt: DateTime!
}

type GamePlayer {
    _id: ID!
    originalId: String!
    avatar: String!
    fullName: String!
    firstName: String
    lastName: String
}

input CreateGameInput {
    title: String!
    lotId: ID!
    startAt: DateTime!
    endAt: DateTime!
}

input UpdateGameInput {
    title: String
    winningDelay: Int
    startAt: DateTime
    endAt: DateTime
}

input CreateGameLotInput {
    title: String!
    text: String!
}

input UpdateGameLotInput {
    title: String
    text: String
}

input CreateGameShotInput {
    message: String!
    playerId: ID!
    gameId: ID!
}

extend type Query {
    games: [Game!]!
    lots: [GameLot!]!
    game(id: ID): Game!
}

extend type Mutation {
    createGameLot(poolId: ID, input: CreateGameLotInput): GameLot
    createGame(input: CreateGameInput) : Game
    updateGame(id: ID, input: UpdateGameInput) : Game
    deleteGame(id: ID) : MutationResponse
}
`;

export default {
    typeDefs,
    resolvers
};
