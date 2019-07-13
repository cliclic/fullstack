import React from 'react'
import './Home.scss'
import {ApolloProvider, Query} from 'react-apollo'
import { apolloClient } from '../../utils/apollo'

import HomeLayout from "./HomeLayout";
import {queryHandler} from "../common/apolloHelpers";
import {GET_ME, MeResponse} from "../common/apolloQueries";

interface HomeState {
    siderCollapsed: boolean
}

class Home extends React.Component<{}, HomeState> {
    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <Query fetchPolicy="network-only" query={GET_ME}>
                    {queryHandler<MeResponse>(({data, client}) => {
                        console.log ('me data', data)
                        apolloClient.writeData({ data });
                        return <HomeLayout client={client} me={data!.me} />
                    })}
                </Query>
            </ApolloProvider>
        );
    }
}

export default Home
