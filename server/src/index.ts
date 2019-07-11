import './database'
import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { PORT } from './modules/common/consts'
import { createAuthServer } from './authentication/authenticationServer'

const app = express()

createAuthServer(app)

const server = new ApolloServer({
  context: ({ req }) => ({
    user: req.user,
  }),
})

server.applyMiddleware({
  app,
})

app.listen({ port: PORT })
console.log(`🚀 Server ready at localhost:${PORT}`)
