import {UserInstance, UserModel} from './UserEntity'
import {passwordEncode} from "../common/helpers";
import {Role} from "./consts";

interface UserInput {
    id: string;
    roles: Role[];
    displayName: string;
    password: string;
}

export async function count () {
  return await UserModel.countDocuments();
}

export async function update(user: UserInstance, fields: Partial<UserInput>) {
    const {roles, displayName, password} = fields;

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
