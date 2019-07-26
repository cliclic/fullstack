export interface UserInput {
  // id: string;
  roles: Role[];
  displayName: string;
  password: string;
}

export enum Role {
  User = 'user',
  Admin = 'admin',
  Super = 'super'
}
