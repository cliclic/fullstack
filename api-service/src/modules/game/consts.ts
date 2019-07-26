export interface GameShotInput {
  message: string;
  gameId: string;
  playerId: string;
}

export interface GamePlayerInput {
  originalId: string;
  avatar: string;
  fullName: string;
  firstName: string;
  lastName: string;
}

export interface GameLotInput {
  title: string;
  text: string;
}

export interface GameInput {
  startAt: Date;
  endAt: Date;
  title: string;
}

