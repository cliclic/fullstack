import axios from 'axios'
import {API_PATH} from "./env";

export const restClient = axios.create({
  baseURL: API_PATH,
  headers: {'Accept': 'application/json'}
});
