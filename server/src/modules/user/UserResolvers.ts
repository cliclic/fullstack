import { UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, requiresRole } from '../common/resolvers'
import { Role } from './consts'
import * as userService from './UserService'

function queryMeResolver(_, __, context) {
  return context.user
}

async function queryUsersResolver() {
  return await userService.find({})
}

async function createUserResolver(_, fields) {
  try {
    return await userService.create(fields)
  } catch (e) {
    throw new UserInputError('Cannot create User', { invalidArgs: Object.keys(fields) })
  }
}

async function updateUserResolver(_, fields) {
  let user
  try {
    user = await userService.findById(fields.id)
  } catch (e) {
    throw new UserInputError('Unknown User', { invalidArgs: ['id'] })
  }
  try {
    return await userService.update(user, fields)
  } catch (e) {
    throw new UserInputError('Cannot update User', { invalidArgs: Object.keys(fields) })
  }
}

async function updateMeResolver(_, fields, { user }) {
  fields.id = user.id
  return await updateUserResolver(_, fields)
}

export default {
  Query: {
    me: combineResolvers(isAuthenticated, queryMeResolver),
    users: combineResolvers(requiresRole(Role.Admin), queryUsersResolver),
  },
  Mutation: {
    createUser: combineResolvers(requiresRole(Role.Admin), createUserResolver),
    updateUser: combineResolvers(requiresRole(Role.Admin), updateUserResolver),
    updateMe: combineResolvers(isAuthenticated, updateMeResolver),
  },
}
