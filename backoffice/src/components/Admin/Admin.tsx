import {Fragment} from 'react'
import {Query, withQuery} from "react-apollo";
import {ApolloQueryResult, gql} from "apollo-boost";
import {queryHandler} from "../common/apolloHelpers";

export enum Role {
    User = 'user',
    Admin = 'admin',
}

interface User
{
    _id: string;
    displayName: string;
    username: string;
    roles: Role[];
}

const GET_USERS = gql`{
    users: {
        _id,
        displayName,
        username,
        roles
    }
}`;

function Admin () {
    return <Query query={GET_USERS}>{
        queryHandler<User[]>((data: User[]) => <pre>{data}</pre>)
    }</Query>
}
