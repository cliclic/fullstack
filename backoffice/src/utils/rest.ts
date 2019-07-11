import { SERVER_URL } from './env'
import axios from 'axios'

export const restClient = axios.create({
  baseURL: SERVER_URL,
})
