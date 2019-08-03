import * as SocketIO from "socket.io";
import {NotificationType} from "../common/consts";

const minNotificationInterval = 1000;

interface RealtimeApiService {
    io?: SocketIO.Server;
    start(ioServer: SocketIO.Server): void;
    notify(notification: RealtimeNotification): void;
}

let flushNotificationsTimeout;
let notificationQueue = [];

export interface RealtimeNotification {
    type: NotificationType;
    data: any;
    timestamp: number;
}

function flushNotifications () {
    if (notificationQueue.length > 0) {
        realtimeApiService.io!.emit('notifications', {
            notifications: notificationQueue,
            serverTime: Date.now()
        });
        notificationQueue = [];
    }
    flushNotificationsTimeout = null;
}

function notify(notification: RealtimeNotification) {
    notificationQueue.push(notification);
    if (!flushNotificationsTimeout) {
        flushNotificationsTimeout = setTimeout(flushNotifications, minNotificationInterval);
    }
}

function start(ioServer: SocketIO.Server) {
    realtimeApiService.io = ioServer;
}

export const realtimeApiService: RealtimeApiService = {
    start,
    notify
};
