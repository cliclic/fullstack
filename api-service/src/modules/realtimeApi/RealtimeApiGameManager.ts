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
            [GameServiceMessageType.gameEnd]: this.onWinner.bind(this)
        }

        addListenersTo(realtimeApiService.io., this.externalGameServiceListeners);
    }

    onWinner(data) {
        realtimeApiService.notify({
            type: NotificationType.winner,
            timestamp: data.timestamp,
            data: data.lot
        });
    }

    destroy() {
        removeListenersFrom(realtimeApiService.io, this.externalGameServiceListeners);
    }
}
