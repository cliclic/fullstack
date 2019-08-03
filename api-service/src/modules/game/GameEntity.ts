import {prop, Typegoose, InstanceType, Ref, arrayProp, pre} from 'typegoose'
import {Schema} from "mongoose";
import ObjectId = Schema.Types.ObjectId;
import {GameTimeSlot} from "./consts";

class GamePlayer extends Typegoose {
    @prop({ required: true, unique: true, index: true })
    originalId: string;

    @prop({ required: true })
    avatar: string;

    @prop({ required: true })
    fullName: string;

    @prop({ default: '' })
    firstName: string;

    @prop({ default: '' })
    lastName: string;

    @prop({ default: () => new Date() })
    createdAt: Date
}

class GameShot extends Typegoose {
    @prop({required: true})
    gameId: ObjectId;

    @prop({ref: GamePlayer, required: true})
    player: Ref<GamePlayer>

    @prop({required: true})
    message: string

    @prop({default: false})
    isWinner: boolean

    @prop({default: () => new Date()})
    createdAt: Date
}

class GameLot extends Typegoose {

    _id: ObjectId

    @prop({ required: true })
    title: string

    @prop({ required: true })
    text: string

    @prop({ref: GameShot, default: null})
    winnerShot: Ref<GameShot>
}

class GameLotPool extends Typegoose {

    @arrayProp({ items: GameLot })
    lots: GameLot[];

}

const GameTimeSlotSchema = new Schema({
    startTime: Number,
    endTime: Number,
    data: {
        winningDelay: Number,
    }
});

@pre<Game>('save', async function() {
    if (!this.lotPool) {
        try {
            this.lotPool = await GameLotPoolModel.findOne({});
            if (!this.lotPool) {
                this.lotPool = await GameLotPoolModel.create({});
            }
        } catch (e) {
            console.error(e);
        }
    }
})
class Game extends Typegoose {
    @prop({default: false})
    completed: boolean

    @prop({default: false})
    started: boolean

    @prop({ required: true, index: true })
    startAt: Date;

    @prop({ required: true, index: true })
    endAt: Date;

    @prop({ required: true })
    title: string;

    @prop({ ref: GameLot, default: null })
    currentLot: Ref<InstanceType<GameLot>>

    @prop({ ref: GameLotPool, required: true })
    lotPool: Ref<InstanceType<GameLotPool>>

    @prop({ required: true })
    timeSlots: [GameTimeSlot];

    @prop()
    winningDelay?: number

    @prop()
    createdAt: Date

    @prop()
    updatedAt: Date
}

export const GameLotModel = new GameLot().getModelForClass(GameLot);

export type GameLotInstance = InstanceType<GameLot>;

export const GameLotPoolModel = new GameLotPool().getModelForClass(GameLotPool);

export type GameLotPoolInstance = InstanceType<GameLotPool>;

export const GameModel = new Game().getModelForClass(Game, {
    schemaOptions: { timestamps: true },
});

export type GameInstance = InstanceType<Game>;

export const PlayerModel = new GamePlayer().getModelForClass(GamePlayer);

export type PlayerInstance = InstanceType<GamePlayer>;

export const GameShotModel = new GameShot().getModelForClass(GameShot);

export type GameShotInstance = InstanceType<GameShot>;
