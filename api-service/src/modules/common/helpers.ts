import { createHmac } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

export function passwordEncode(password: string) {
  const salt = uuidv4()
  const hmac = createHmac('sha256', salt)
  hmac.update(password)
  return hmac.digest('hex') + salt
}

export function passwordValidate(password: string, passwordHash: string) {
  const encodedPassword = passwordHash.slice(0, 64)
  const salt = passwordHash.slice(64)
  const hmac = createHmac('sha256', salt)
  hmac.update(password)
  return hmac.digest('hex') === encodedPassword
}
