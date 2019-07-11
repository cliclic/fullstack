import { ModelType } from 'typegoose'
import GameModel, { Game } from './GameEntity'

export class GameService {
  private readonly model: ModelType<Game>

  constructor() {
    this.model = GameModel
  }

  async find(selector?: Partial<Game>) {
    return this.model.find(selector)
  }

  async findOneById(_id: string) {
    return this.model.findOne({ _id })
  }

  async remove(_id: string) {
    let entityToRemove = await this.model.findOne(_id)
    await this.model.remove(entityToRemove)
  }
}
