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


export interface Game
{
    _id: string;
    completed: boolean;
    startAt: Date;
    endAt: Date;
    title: string;
    currentLot: GameLot;
    winningDelay: Number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameLot
{
    _id: string;
    completed: boolean;
    startAt: Date;
    endAt: Date;
    title: string;
    currentLot: GameLot;
    winningDelay: Number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameLot {
    _id: string;
    title: string;
    text: string;
    winnerShot?: GameShot;
}

export interface GameLotPool {
    _id: string;
    lots: GameLot[]
}

export interface GameShot {
    gameId: string;
    player: GamePlayer;
    message: string;
    isWinner: boolean;
    createdAt: Date;
}

export interface GamePlayer {
    originalId: string;
    avatar: string;
    fullName: string;
    firstName: string;
    lasttName: string;
    createdAt: string;
}
