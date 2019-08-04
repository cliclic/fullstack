import { get } from 'config'

export const PORT: number = get('PORT')
export const MONGO_HOST: string = get('MONGO_HOST')
export const DB_NAME: string = get('DB_NAME')
export const GAME_SERVICE_PASSWORD: string = get('GAME_SERVICE_PASSWORD')
export const GAME_SERVICE_URL: string = get('GAME_SERVICE_URL')

export enum NotificationType {
    newShot = 'new-shot',
    winner = 'winner',
    lotChange = 'lot-change',
    winningDelayChange = 'winning-delay-change',
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
