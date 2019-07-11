import { index, prop, Typegoose } from 'typegoose'
import { Role } from './consts'

export interface AccessToken {
  token: string
  createdAt: Date
}

@index({ 'tokens.id': 1 })
export class User extends Typegoose {
  @prop({ required: true, index: true, unique: true })
  username: string

  @prop({ required: true })
  displayName: string

  @prop({ required: true })
  password: string

  @prop({ required: true, enum: Role })
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
