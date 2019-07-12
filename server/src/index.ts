import './database'
import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { PORT } from './modules/common/consts'
import { createAuthServer } from './authentication/authenticationServer'
import {mergeSchemas} from "graphql-toolkit";
import {userSchema} from "./modules/user";
import * as cors from 'cors';

const app = express()

app.use(cors())

const server = new ApolloServer({
  context: ({ req }) => ({
    user: req.user,
  }),
  schema: mergeSchemas({schemas: [userSchema]}),
  playground: true
});

createAuthServer(app);

server.applyMiddleware({
  app,
});

app.use(function (req,res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});


app.listen({ port: PORT });
console.log(`🚀 Server ready at localhost:${PORT}`);
