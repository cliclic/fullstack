import { Connection } from 'mongoose'
import { UserModel } from '../../../api-service/src/modules/user/UserEntity'
import { ADMIN_USER_PASSWORD } from '../common/consts'
import { passwordEncode } from '../../../api-service/src/modules/common/helpers'
import { GameLotPoolModel } from "../../../api-service/src/modules/game/GameEntity";

export default async function initializeDatabase(db: Connection) {
  const usersCount = await UserModel.countDocuments()
  console.log('User count : ', usersCount)
  if (usersCount === 0) {
    const adminUser = new UserModel({
      username: 'admin',
      displayName: 'Admin',
      roles: ['admin', 'user'],
      password: passwordEncode(ADMIN_USER_PASSWORD),
    });

    adminUser.save();
  }
  const lotPool = await GameLotPoolModel.findOne({});
  if (!lotPool) {
    await GameLotPoolModel.create({});
  }
}
