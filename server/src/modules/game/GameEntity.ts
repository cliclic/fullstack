import { Ref, prop, arrayProp, Typegoose } from 'typegoose'
import { ObjectType, Field, ID } from 'type-graphql'
import { ObjectId } from 'mongodb'

@ObjectType()
export class Shot {
  @prop({ required: true })
  @Field()
  accessToken: string

  @prop({ required: true })
  @Field()
  itemId: string
}

@ObjectType()
export class Round {
  @prop({ required: true })
  @Field(type => Date)
  startAt: Date

  @prop({ required: true })
  @Field(type => Date)
  endAt: Date

  @prop({ required: true })
  @Field()
  lotTitle: string

  @arrayProp({ itemsRef: Shot })
  @Field(type => [Shot])
  shots: Ref<Shot>[]
}

@ObjectType()
export class Game extends Typegoose {
  @prop()
  @Field(type => ID)
  readonly _id: ObjectId

  @arrayProp({ items: Round })
  @Field(type => [Round])
  rounds: Round[]

  @prop({ required: true })
  title: string

  @prop({ default: false })
  isPublished: boolean

  @prop({ default: () => new Date() })
  @Field(type => Date)
  createdAt: Date
}

export default new Game().getModelForClass(Game, {
  schemaOptions: { timestamps: true },
})
