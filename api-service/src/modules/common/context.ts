import { UserInstance } from '../user/UserEntity'

export interface Context {
  userId?: string
  user?: UserInstance
}
