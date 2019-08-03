import './database'
import * as http from "http";
import {PORT, SOCKET_PASSWORD} from "./common/consts";
import * as SocketIO from "socket.io";
import * as express from 'express'
import {GameRunner} from "./GameRunner";
import ioService from './ioService'

const app = express();
const httpServer = http.createServer(app);
const socketIOServer = SocketIO(httpServer, {pingTimeout: 10000, pingInterval: 10000});

socketIOServer.use(function (socket, next) {
    if (socket.request.headers['ma-bite-a-l-air'] === SOCKET_PASSWORD) return next();
    next(new Error('Authentication error'));
});

ioService.start(socketIOServer);
GameRunner.start();

httpServer.listen(PORT);

console.log(`🚀 Server ready at localhost:${PORT}`);
