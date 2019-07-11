import { Environments, PlaidEnvs, PlaidCountryCodes, PlaidProducts } from './types'

interface ENV {
  NODE_ENV: Environments
  SERVER_URL: string
}

function getEnvVars(env = '', envVars: any): ENV {
  if (env.indexOf(Environments.dev) !== -1) return envVars.dev
  if (env.indexOf(Environments.stag) !== -1) return envVars.staging
  if (env.indexOf(Environments.prod) !== -1) return envVars.prod
  return envVars.dev
}

const dev = require('../config/development.env.json')
const env = getEnvVars(process.env.NODE_ENV, {
  dev,
  // staging: {
  //
  // },
  // prod: {
  //
  // }
})

export const NODE_ENV = env.NODE_ENV
export const SERVER_URL = env.SERVER_URL
