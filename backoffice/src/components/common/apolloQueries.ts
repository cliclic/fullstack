import {Role, User} from "./consts";
import {gql} from "apollo-boost";
import {OnboardUserMutationVariables} from "../../../../client/src/generated/graphql";
import {string} from "prop-types";

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
