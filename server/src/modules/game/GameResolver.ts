import { Arg, Resolver, Query, Authorized, Mutation, Ctx, ID, InputType, Field } from 'type-graphql'
import { Context } from '../common/context'
import { GameService } from './GameService'
import { Game, Round } from './GameEntity'
import './enums'
import { accountsPassword } from './accounts'
import { Role } from './consts'
import { client as plaid } from '../payments/plaid'

@InputType()
class CreateGameInput {
  @Field()
  title: string
}

@InputType()
export class CreateRoundInput {
  @Field(type => Date)
  startAt: string

  @Field(type => Date)
  endAt: string

  @Field()
  lotTitle: string
}

@Resolver(Game)
export default class GameResolver {
  private readonly service: GameService

  constructor() {
    this.service = new GameService()
  }

  @Query(returns => Game)
  @Authorized()
  async game(@Arg('gameId') gameId: string) {
    return await this.service.findOneById(gameId)
  }

  // this overrides accounts js `createGame` function
  @Mutation(returns => ID)
  async createGame(@Arg('game', type => CreateGameInput) game: CreateGameInput) {
    return await this.service.createGame(game)
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async onboardGame(
    @Arg('publicToken') publicToken: string,
    @Arg('property') property: PropertyInput,
    @Ctx() ctx: Context
  ) {
    return new Promise((resolve, reject) => {
      plaid.exchangePublicToken(publicToken, async (err, response) => {
        if (err != null) reject(err)

        const game = await this.service.findOneById(ctx.gameId)
        game.plaid = {
          accessToken: response.access_token,
          itemId: response.item_id,
        }
        game.properties = [property]
        game.isOnboarded = true
        await game.save()

        resolve(true)
      })
    })
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async setPlaidToken(@Arg('publicToken') publicToken: string, @Ctx() ctx: Context) {
    return new Promise((resolve, reject) => {
      plaid.exchangePublicToken(publicToken, async (err, response) => {
        if (err != null) reject(err)

        const game = await this.service.findOneById(ctx.gameId)
        game.plaid = {
          accessToken: response.access_token,
          itemId: response.item_id,
        }
        await game.save()

        resolve(true)
      })
    })
  }

  // @FieldResolver(returns => String)
  // async firstName(@Root() game: Game) {
  //   return game.profile.firstName
  // }

  // @FieldResolver(returns => String)
  // async lastName(@Root() game: Game) {
  //   return game.profile.lastName
  // }
}
