import {Game, GameLot, GameLotPool, GameTimeSlot, Role, User} from "./consts";
import {gql} from "apollo-boost";

export const GET_USERS = gql`{
    users {
        _id,
        displayName,
        username,
        roles
    }
}`;

export interface GetUsersResponse {
    users: User[]
}

export interface SetUserRolesVariables {
    id: string,
    roles: Role[]
}

export interface SetUserRolesResponse {
    updateUser: Pick<User, 'roles' | '_id'>
}

export interface MeResponse {
    me: User
}

export const GET_ME = gql`{
    me {
        displayName
        roles
    }
}`;

export const GET_USER_ROLES = gql`
    query ReadUserRole($id: ID) {
        user(id: $id) {
            _id
            roles
        }
    }
`

export const SET_USER_ROLES = gql`
    mutation SetUserRoles($id: ID, $roles: [Role]) {
        updateUser(id: $id, input: {roles: $roles}) {
            _id
            roles
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID) {
        deleteUser(id: $id) { 
            success 
        }
    }
`;

export interface DeleteUserVariables {
    id: string,
}

export interface DeleteUserResponse {
    success: boolean;
}

export const CREATE_USER = gql`
    mutation CreateUser($input: CreateUserInput) {
        createUser(input: $input) {
            _id
        }
    }
`

export interface CreateUserVariables {
    input: CreateUserInput
}

export interface CreateUserInput {
    username: string
    password: string
    displayName: string
    roles: Role[]
}

export interface CreateUserResponse {
    _id: string
}


/** ******** GAMES ******** **/

export const GET_GAMES_AND_LOTS = gql`{
    lotPool {
        _id,
        lots {
            _id,
            title,
            text,
            winnerShot{
                _id,
                player{
                    _id,
                    originalId,
                    avatar,
                    fullName,
                    firstName,
                    lastName
                },
                message,
                createdAt
            }
        }
    },
    games {
        _id,
        completed,
        title,
        startAt,
        endAt,
        createdAt,
        currentLot {
            _id,
            title,
            winnerShot {
                player {
                    fullName,
                    avatar
                }
            }
        }
    }
}`;

export const CREATE_GAME = gql`
    mutation CreateGame($input: CreateGameInput) {
        createGame(input: $input) {
            _id
        }
    }
`

export interface CreateGameVariables {
    input: CreateGameInput
}

export interface CreateGameInput {
    title: string
    startAt: Date
    endAt: Date
    timeSlots: GameTimeSlot[]
}

export interface CreateGameResponse {
    _id: string
}

export interface GetGamesAndLotsResponse {
    games: Game[];
    lotPool: GameLotPool;
    lotPoolId: string;
}

export const DELETE_GAME = gql`
    mutation DeleteGame($id: ID) {
        deleteGame(id: $id) {
            success
        }
    }
`;

export interface DeleteGameVariables {
    id: string,
}

export interface DeleteGameResponse {
    success: boolean;
}

/** ******** GAME LOTS ******** **/

export const CREATE_GAME_LOT = gql`
    mutation CreateGameLot($poolId: ID, $input: CreateGameLotInput) {
        createGameLot(poolId: $poolId, input: $input) {
            _id
        }
    }
`

export interface CreateGameLotVariables {
    poolId: string;
    input: CreateGameLotInput;
}

export interface CreateGameLotInput {
    title: string
    text: string
}

export interface CreateGameLotResponse {
    _id: string
}

export interface GetGameLotsResponse {
    lots: GameLot[]
}

export const DELETE_GAME_LOT = gql`
    mutation DeleteGameLot($poolId: ID, $id: ID) {
        deleteGameLot(poolId: $poolId, id: $id) {
            success
        }
    }
`;

export interface DeleteGameLotVariables {
    poolId: string,
    id: string,
}

export interface DeleteGameLotResponse {
    success: boolean;
}

export interface MoveGameLotVariables {
    poolId: string;
    id: string;
    direction: string;
}

export const MOVE_GAME_LOT = gql`
    mutation MoveGameLot($poolId: ID, $id: ID, $direction: String) {
        moveGameLot(poolId: $poolId, id: $id, direction: $direction) {
            success
        }
    }
`

export interface MoveGameLotResponse {
    moveGameLot: {
        success: boolean;
        __typename: string;
    };
}
