import {UserInstance, UserModel} from './UserEntity'
import {passwordEncode} from "../common/helpers";
import {UserInput} from "./consts";

export async function count () {
  return await UserModel.countDocuments();
}

export async function update(user: UserInstance, fields: Partial<UserInput>) {
    const {roles, displayName, password} = fields;

    console.log ('update roles', roles, fields);
    if (typeof roles !== 'undefined' && Array.isArray(roles)) {
        user.roles = roles;
    }

    if (typeof displayName === 'string') {
        user.displayName = displayName;
    }

    if (typeof password === 'string') {
        user.password = passwordEncode(password);
    }

    await user.save();
    return user;
}

export async function create(fields: UserInput) {
    console.log (fields);
    const user = await UserModel.create(fields);
    await user.save();
    return user;
}

export async function find(search) {
    return await UserModel.find(search);
}

export async function findById(id) {
    return await UserModel.findById(id);
}
