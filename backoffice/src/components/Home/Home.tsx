import React from 'react'
import './Home.scss'
import {ApolloProvider, Query} from 'react-apollo'
import { apolloClient } from '../../utils/apollo'

import {gql} from "apollo-boost";
import HomeLayout from "./HomeLayout";
import {queryHandler} from "../common/apolloHelpers";
import {User} from "../common/consts";

interface HomeState {
    siderCollapsed: boolean
}

interface MeResponse {
    me: User
}

const GET_ME = gql`{
    me {
        displayName
        roles
    }
}`;

class Home extends React.Component<{}, HomeState> {
    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <Query query={GET_ME}>
                    {queryHandler<MeResponse>((data, client) => {
                        apolloClient.writeData({ data });
                        return <HomeLayout client={client} me={data.me} />
                    })}
                </Query>
            </ApolloProvider>
        );
    }
}

export default Home
