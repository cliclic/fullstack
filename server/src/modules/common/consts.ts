import { get } from 'config'

export const PORT: number = get('PORT')
export const MONGO_HOST: string = get('MONGO_HOST')
export const DB_NAME: string = get('DB_NAME')
export const ADMIN_USER_PASSWORD: string = get('ADMIN_USER_PASSWORD')
