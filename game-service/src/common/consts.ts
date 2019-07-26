import { get } from 'config'

export const PORT: number = get('PORT')
export const MONGO_HOST: string = get('MONGO_HOST')
export const DB_NAME: string = get('DB_NAME')
export const SOCKET_PASSWORD: string = get('SOCKET_PASSWORD')

export enum NotificationType {
    newShot = 'new-shot'
}

export enum QueryResponseStatus {
    ok = "ok",
    error = "error"
}

export interface QueryResponse<T> {
    data: T;
    status: QueryResponseStatus;
    cursor?: {
        next?: number | string;
        previous?: number | string;
    }
}
