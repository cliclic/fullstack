import * as SocketIO from "socket.io";
import {GameInstance, GameLotInstance} from "../../api-service/src/modules/game/GameEntity";
import {GameServiceMessageType} from "./consts";

let io: SocketIO.Server;

function start(ioServer: SocketIO.Server) {
    io = ioServer;
    setInterval(function () {
        io.emit('t', Date.now());
    }, 5000);
}

function sendWinner(winnedLot: GameLotInstance) {
    io.emit(GameServiceMessageType.winner, {
        winnedLot,
        timestamp: Date.now()
    });
}

function sendGameStart(game: GameInstance) {
    io.emit(GameServiceMessageType.gameStart, {
        gameId: game._id,
        timestamp: Date.now()
    });
}

function sendGameEnd(game: GameInstance) {
    io.emit(GameServiceMessageType.gameEnd, {
        gameId: game._id,
        timestamp: Date.now()
    });
}

function sendGameLotChange(game: GameInstance) {
    io.emit(GameServiceMessageType.gameLotChange, {
        gameId: game._id,
        lot: game.currentLot,
        timestamp: Date.now()
    });
}

function sendGameWinningDelayChange(game: GameInstance, winningDelay: number) {
    io.emit(GameServiceMessageType.gameWinningDelayChange, {
        gameId: game._id,
        winningDelay,
        timestamp: Date.now()
    })
}

export default {
    start,
    sendWinner,
    sendGameStart,
    sendGameEnd,
    sendGameLotChange,
    sendGameWinningDelayChange,
}
