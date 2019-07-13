import * as React from 'react';
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import {queryHandler} from "../common/apolloHelpers";
import {User} from "../common/consts";
import {AdminUserTable} from "./AdminUserTable";

const GET_USERS = gql`{
    users {
        _id,
        displayName,
        username,
        roles
    }
}`;

interface UserResponse {
    users: User[]
}

export default function Admin () {
    return <Query query={GET_USERS}>{
        queryHandler<UserResponse>((data) => {
            return <AdminUserTable users={data.users} />
        })
    }</Query>
}
