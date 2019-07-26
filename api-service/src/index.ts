import './database'
import * as express from 'express'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express'
import { PORT } from './modules/common/consts'
import { createAuthServer } from './authentication/authenticationServer'
import commonSchema from './modules/common/schema';
import {userSchema} from "./modules/user";
import {gameSchema, startGameService} from "./modules/game";
import {startRealtimeService} from "./modules/common/realtimeService";
import * as http from "http";
import * as SocketIO from "socket.io";
import {merge} from 'lodash';

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
  schema: makeExecutableSchema({
    typeDefs: [commonSchema.typeDefs, userSchema.typeDefs, gameSchema.typeDefs],
    resolvers: merge(userSchema.resolvers, gameSchema.resolvers)
  }),
  playground: true
});

createAuthServer(app);

server.applyMiddleware({
  app
});

startGameService();

httpServer.listen(PORT);

console.log(`🚀 Server ready at localhost:${PORT}`);
