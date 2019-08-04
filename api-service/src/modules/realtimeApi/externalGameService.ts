import {GAME_SERVICE_URL} from "../common/consts";
import * as SocketIOClient from "socket.io-client";
import {GameServiceMessageType} from "../../../../game-service/src/consts";
import {timeRefService} from "../common/timeRefService";
import {RealtimeApiGameManager} from "./RealtimeApiGameManager";

const gameServiceSocket = SocketIOClient(GAME_SERVICE_URL, {forceNew : true});

gameServiceSocket.on('connect', function(){
    console.log('Game service connected');
});

gameServiceSocket.on('disconnect', function(){
    console.log('Game service disconnected');
});

gameServiceSocket.on(GameServiceMessageType.init, function (data) {
    timeRefService.updateTimeRef(data.timestamp);
    if (Array.isArray(data.runningGames)) {
        data.runningGames.forEach(game => {
            if (!runningGames.has(game._id)) {
                runningGames.set(game._id, new RealtimeApiGameManager(game._id));
            }
        })
    }
});

gameServiceSocket.on(GameServiceMessageType.gameStart, function (data) {
    if (!runningGames.has(data.gameId)) {
        runningGames.set(data.gameId, new RealtimeApiGameManager(data.gameId));
    }
});

gameServiceSocket.on(GameServiceMessageType.gameEnd, function (data) {
    const game = runningGames.get(data.gameId);
    if (game) {
        runningGames.delete(data.gameId);
        game.destroy();
    }
});

gameServiceSocket.on('t', function (timestamp) {
    timeRefService.updateTimeRef(timestamp);
});

gameServiceSocket.on(GameServiceMessageType.gameStart, function (data) {

});

const runningGames = new Map<string, RealtimeApiGameManager>();

export const externalGameService = {
    io: gameServiceSocket
};
