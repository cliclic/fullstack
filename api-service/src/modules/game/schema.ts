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
    title: String!
    startAt: DateTime!
    endAt: DateTime!
    currentLot: GameLot
    lotPool: GameLotPool!
    createdAt: DateTime!
    timeSlots: [GameTimeSlot!]!
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

type GameTimeSlot {
    startTime: Int!
    endTime: Int!
    data: GameTimeSlotData
}

type GameTimeSlotData {
    winningDelay: Int!
}

input UpdateGameInput {
    _id: ID
    title: String
    startAt: DateTime
    endAt: DateTime
    timeSlots: [GameTimeSlotInput]
}

input GameTimeSlotInput {
    startTime: Int!
    endTime: Int!
    data: GameTimeSlotDataInput
}

input GameTimeSlotDataInput {
    winningDelay: Int!
}

input UpdateGameLotInput {
    _id: ID
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
    lotPool(id: ID): GameLotPool
    game(id: ID): Game!
}

extend type Mutation {
    updateGame(input: UpdateGameInput) : Game
    deleteGame(id: ID) : MutationResponse
    updateGameLot(poolId: ID, input: UpdateGameLotInput) : GameLot
    deleteGameLot(poolId: ID, id: ID) : MutationResponse
    moveGameLot(poolId: ID, id: ID, direction: String) : MutationResponse
}
`;

export default {
    typeDefs,
    resolvers
};
