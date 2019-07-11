import './database'
import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { PORT } from './modules/common/consts'
import { createAuthServer } from './authentication/authenticationServer'
import {mergeSchemas} from "graphql-toolkit";
import {userSchema} from "./modules/user";

const app = express()

const server = new ApolloServer({
  context: ({ req }) => ({
    user: req.user,
  }),
  schema: mergeSchemas({schemas: [userSchema]}),
  playground: true
});

server.applyMiddleware({
  app,
});

app.use(function (req,res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

createAuthServer(app);

app.listen({ port: PORT });
console.log(`🚀 Server ready at localhost:${PORT}`);
