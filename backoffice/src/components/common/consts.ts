export enum Role {
    User = 'user',
    Admin = 'admin',
    Super = 'super',
}

export interface User
{
    _id: string;
    displayName: string;
    username: string;
    roles: Role[];
}

export interface LocalCache {
    me?: User
}
