import { createHmac } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import EventEmitter = NodeJS.EventEmitter;

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


export interface ListenerMap {
  [index: string]: (...args: any) => void;
}

export function addListenersTo(target: EventEmitter, listeners: ListenerMap): EventEmitter {
  for (const i in listeners) {
    target.on(i, listeners[i]);
  }
  return target;
}

export function removeListenersFrom(target: EventEmitter, listeners: ListenerMap): EventEmitter {
  for (const i in listeners) {
    target.removeListener(i, listeners[i]);
  }
  return target;
}
