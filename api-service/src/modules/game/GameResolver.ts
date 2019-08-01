import { UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { requiresRole } from '../common/resolvers'
import * as gameService from './gameService'
import { Role } from '../user'

async function queryGamesResolver(_, fields) {
    return await gameService.find({})
}

async function queryGameResolver(_, fields) {
    return await gameService.findById(fields.id);
}

async function queryLotsResolver(args) {
    let id = args ? args.id : null;
    return await gameService.findOneGameLotPool(id ? {_id: id} : {});
}

async function createGameResolver(_, fields) {
    try {
        return await gameService.createGame(fields.input)
    } catch (e) {
        console.error (e);
        throw new UserInputError('Cannot create User', { invalidArgs: Object.keys(fields) })
    }
}

async function updateGameResolver(_, fields) {
    let user
    try {
        user = await gameService.findById(fields.id)
    } catch (e) {
        throw new UserInputError('Unknown Game', { invalidArgs: ['id'] })
    }
    try {
        return await gameService.update(user, fields.input)
    } catch (e) {
        throw new UserInputError('Cannot update Game', { invalidArgs: Object.keys(fields) })
    }
}

async function createGameLotResolver(_, fields) {
    let lotPool;
    try {
        lotPool = await gameService.findLotPoolById(fields.poolId);
    } catch (e) {
        console.error (e);
        throw new UserInputError('Cannot find pool', { invalidArgs: ['poolId'] })
    }
    try {
        return await gameService.createGameLot(lotPool, fields.input);
    } catch (e) {
        console.error (e);
        throw new UserInputError('Cannot create GameLot', { invalidArgs: ['input'] })
    }
}

async function moveGameLotResolver(_, fields) {
    return {
        success: await gameService.moveGameLot(fields.poolId, fields.id, fields.direction),
        __typename: "MutationResponse"
    };
}

async function deleteGameLotResolver(_, fields) {
    return {
        success: await gameService.deleteGameLot(fields.poolId, fields.id),
    };
}

export default {
    Query: {
        game: combineResolvers(requiresRole(Role.User), queryGameResolver),
        games: combineResolvers(requiresRole(Role.User), queryGamesResolver),
        lotPool: combineResolvers(requiresRole(Role.User), queryLotsResolver),
    },
    Mutation: {
        createGame: combineResolvers(requiresRole(Role.User), createGameResolver),
        updateGame: combineResolvers(requiresRole(Role.User), updateGameResolver),
        createGameLot: combineResolvers(requiresRole(Role.User), createGameLotResolver),
        deleteGameLot: combineResolvers(requiresRole(Role.User), deleteGameLotResolver),
        moveGameLot: combineResolvers(requiresRole(Role.User), moveGameLotResolver),
    },
}
