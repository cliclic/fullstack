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

export async function updateGame(gameId: string, fields: GameInput) {
    return await GameModel.findByIdAndUpdate(gameId, fields, {runValidators: true});
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


export async function createGameLot(pool: GameLotPoolInstance, fields: GameLotInput) {
    const lot = await GameLotModel.create(fields);
    await lot.save();
    pool.lots.push(lot);
    await pool.save();
    return lot;
}

export async function updateGameLot(pool: GameLotPoolInstance, lotId: string, fields: GameLotInput) {
    const lot = pool.lots.find(lot => lot._id.toString() === lotId);
    for (const i in fields) {
        if (i === '_id') continue;
        lot[i] = fields[i];
    }
    pool.markModified('lots');
    await pool.save();
    return lot;
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

export async function findOneGameLotPool(search) {
    const pool = await GameLotPoolModel.findOne(search);
    return pool;
}

export async function moveGameLot(poolId, id, direction) {
    const pool = await findOneGameLotPool({});
    const index = pool.lots.findIndex(lot => lot._id.toString() === id);
    if (index > -1) {
        if (direction === "down") {
            if (index < pool.lots.length - 1) {
                pool.lots.splice(index + 1, 0, pool.lots.splice(index, 1)[0]);
                await pool.save();
                return true;
            }
        } else {
            if (index > 0) {
                pool.lots.splice(index - 1, 0, pool.lots.splice(index, 1)[0]);
                await pool.save();
                return true;
            }
        }
    }
    return false;
}

export async function deleteGameLot(poolId, id) {
    const pool = await findOneGameLotPool({});
    const index = pool.lots.findIndex(lot => lot._id.toString() === id);
    if (index > -1) {
        pool.lots.splice(index, 1);
        await pool.save();
        return true;
    }
    return false;
}

export function start() {
    realTimeService.io.on('new-shot', async function (data: GameShotInput) {
        createShot(data);
    });
}
