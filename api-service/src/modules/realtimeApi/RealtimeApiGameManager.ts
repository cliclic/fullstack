import * as SocketIO from 'socket.io';
import {GameServiceMessageType} from "../../../../game-service/src/consts";
import {NotificationType} from "../common/consts";
import {realtimeApiService} from "./realtimeApiService";
import {addListenersTo, ListenerMap, removeListenersFrom} from "../common/helpers";


export class RealtimeApiGameManager {

    gameId: string;
    io: SocketIO.Namespace;
    externalGameServiceListeners: ListenerMap;

    constructor(gameId: string) {
        this.gameId = gameId;
        this.io = realtimeApiService.io.of(gameId);

        this.externalGameServiceListeners = {
            [GameServiceMessageType.winner]: this.onWinner.bind(this),
            [GameServiceMessageType.gameLotChange]: this.onGameLotChange.bind(this),
            [GameServiceMessageType.gameWinningDelayChange]: this.onGameWinningDelayChange.bind(this),
        };

        addListenersTo(realtimeApiService.io.of('/'), this.externalGameServiceListeners);
    }

    onWinner(data) {
        if (data.gameId === this.gameId) {
            realtimeApiService.notify({
                type: NotificationType.winner,
                timestamp: data.timestamp,
                data: data.winnedLot
            });
        }
    }

    onGameLotChange(data) {
        if (data.gameId === this.gameId) {
            realtimeApiService.notify({
                type: NotificationType.lotChange,
                timestamp: data.timestamp,
                data: data.lot
            });
        }
    }

    onGameWinningDelayChange(data) {
        if (data.gameId === this.gameId) {
            realtimeApiService.notify({
                type: NotificationType.winningDelayChange,
                timestamp: data.timestamp,
                data: data.winningDelay
            });
        }
    }

    destroy() {
        removeListenersFrom(realtimeApiService.io.of('/'), this.externalGameServiceListeners);
    }
}
