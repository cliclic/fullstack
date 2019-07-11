import { Connection } from 'mongoose'
import { UserModel } from '../modules/user/UserEntity'
import { ADMIN_USER_PASSWORD } from '../modules/common/consts'
import { passwordEncode } from '../modules/common/helpers'

export default async function initializeDatabase(db: Connection) {
  const usersCount = await UserModel.countDocuments()
  console.log('User count : ', usersCount)
  if (usersCount === 0) {
    const adminUser = new UserModel({
      username: 'admin',
      displayName: 'Admin',
      roles: ['admin', 'user'],
      password: passwordEncode(ADMIN_USER_PASSWORD),
    })
  }
}
