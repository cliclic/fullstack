import React from 'react'
import './Home.scss'
import {ApolloProvider, Query} from 'react-apollo'
import { apolloClient } from '../../utils/apollo'

import {gql} from "apollo-boost";
import HomeLayout from "./HomeLayout";
import {queryHandler} from "../common/apolloHelpers";

interface HomeState {
    siderCollapsed: boolean
}

const GET_ME = gql`{
    me {
        displayName
        roles
    }
}`;

class Home extends React.Component<{}, HomeState> {
    state = {
        siderCollapsed: false,
    };

    onCollapse = (siderCollapsed: boolean) => {
        this.setState({ siderCollapsed });
    };

    render() {
        return (
            <ApolloProvider client={apolloClient}>
                <Query query={GET_ME}>
                    {queryHandler((data) => {
                        console.log ('me', data);
                        return <HomeLayout />
                    })}
                </Query>
            </ApolloProvider>
        );
    }
}

export default Home
