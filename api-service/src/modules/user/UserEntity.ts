import {index, prop, Typegoose, InstanceType, arrayProp} from 'typegoose'
import { Role } from './consts'

export interface AccessToken {
  token: string
  createdAt: Date
}

console.log ('ROLE : ', Role);

@index({ 'tokens.id': 1 })
class User extends Typegoose {
  @prop({ required: true, index: true, unique: true })
  username: string

  @prop({ required: true })
  displayName: string

  @prop({ required: true })
  password: string

  @arrayProp({ required: true, items: String, enum: Role })
  roles: Role[]

  @prop({ default: [] })
  tokens: AccessToken[]

  @prop()
  createdAt: Date

  @prop()
  updatedAt: Date
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

export type UserInstance = InstanceType<User>;
