import './database'
import * as express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { PORT } from './modules/common/consts'
import { createAuthServer } from './authentication/authenticationServer'
import {mergeSchemas} from "graphql-toolkit";
import {userSchema} from "./modules/user";
import {startRealtimeService} from "./modules/common/realtimeService";
import * as http from "http";
import * as SocketIO from "socket.io";
const app = express();
const httpServer = http.createServer(app);
const socketIOServer = SocketIO(httpServer, {pingTimeout: 10000, pingInterval: 10000});
startRealtimeService(socketIOServer);

app.use(function (req: http.IncomingMessage, res, next) {
  next();
});

const server = new ApolloServer({
  context: ({ req }) => ({
    user: req.user,
  }),
  schema: mergeSchemas({schemas: [userSchema]}),
  playground: true
});

createAuthServer(app);

server.applyMiddleware({
  app
});

httpServer.listen(PORT);

console.log(`🚀 Server ready at localhost:${PORT}`);
