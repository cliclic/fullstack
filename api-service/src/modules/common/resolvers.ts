import { AuthenticationError, ForbiddenError } from 'apollo-server'

export function isAuthenticated(root, args, context) {
  if (!context.user) {
    throw new AuthenticationError('Must authenticate !')
  }
}

export function requiresRole(...roles) {
  return function(root, args, context) {
    for (let i = 0, l = roles.length; i < l; i++) {
      if (!context.user || context.user.roles.indexOf(roles[i]) === -1)
        throw new ForbiddenError('User does not have the role to access this resource')
    }
  }
}
