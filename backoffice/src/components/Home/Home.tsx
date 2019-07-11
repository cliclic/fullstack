import React from 'react'
import './Home.scss'
import { ApolloProvider } from 'react-apollo'
import { apolloClient } from '../../utils/apollo'

const Home: React.FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="Home"></div>
    </ApolloProvider>
  )
}

export default Home
