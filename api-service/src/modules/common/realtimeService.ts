import * as SocketIO from "socket.io";
import {GAME_SERVICE_URL, NotificationType} from "./consts";
import * as SocketIOClient from 'socket.io-client';

export const gameServiceSocket = SocketIOClient(GAME_SERVICE_URL, {forceNew : true});

gameServiceSocket.on('connect', function(){
    console.log('Game service connected');
});

gameServiceSocket.on('disconnect', function(){
    console.log('Game service disconnected');
});

const minNotificationInterval = 1000;

export let io:SocketIO.Server;
let flushNotificationsTimeout;
let notificationQueue = [];

export interface RealtimeNotification {
    type: NotificationType;
    data: any;
    timestamp: number;
}

function flushNotifications () {
    if (notificationQueue.length > 0) {
        io!.emit('notifications', {
            notifications: notificationQueue,
            serverTime: Date.now()
        });
        notificationQueue = [];
    }
    flushNotificationsTimeout = null;
}

export function notify(notification: RealtimeNotification) {
    notificationQueue.push(notification);
    if (!flushNotificationsTimeout) {
        flushNotificationsTimeout = setTimeout(flushNotifications, minNotificationInterval);
    }
}

export function startRealtimeService (ioServer: SocketIO.Server) {
    io = ioServer;
    gameServiceSocket.on('winner', function (data: any) {
        notify({
            type: NotificationType.winner,
            timestamp: data.timestamp,
            data: data.lot
        });
    });
}
