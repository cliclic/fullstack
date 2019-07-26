import {GameInstance, GameLotModel, GameLotPoolInstance, GameLotPoolModel, GameModel, GameShotModel} from './GameEntity'
import {GameInput, GameShotInput, GameLotInput} from "./consts";
import * as realTimeService from "../common/realtimeService";
import {NotificationType} from "../common/consts";

export async function count () {
    return await GameModel.countDocuments();
}

export async function update(game: GameInstance, fields: Partial<GameInput>) {
    const {startAt, endAt, title} = fields;

    console.log ('update game', fields);

    await game.save();
    return game;
}

export async function createGame(fields: GameInput) {
    const game = await GameModel.create(fields);
    await game.save();
    return game;
}

export async function createGameLot(pool: GameLotPoolInstance, fields: GameLotInput) {
    const lot = await GameLotModel.create(fields);
    await lot.save();
    pool.lots.push(lot);
    await pool.save();
    return lot;
}

export async function createShot(input: GameShotInput) {
    const gameShot = await GameShotModel.create({
        message: input.message,
        game: input.gameId,
        player: input.playerId
    });

    await gameShot.save();
    realTimeService.notify({
        type: NotificationType.newShot,
        data: gameShot,
        timestamp: Date.now()
    });
    return gameShot;
}

export async function find(search) {
    return await GameModel.find(search);
}

export async function findById(id) {
    return await GameModel.findById(id);
}

export async function findLotPoolById(id) {
    return await GameLotPoolModel.findById(id);
}

export async function findGameLotsByPool(poolId: String) {
    const pool = await GameLotPoolModel.findById(poolId).populate('lots');
    return pool.lots;
}

realTimeService.io.on('new-shot', async function (data: GameShotInput) {
    createShot(data);
});
