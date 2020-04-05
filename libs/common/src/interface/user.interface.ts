export enum UserStatus {
  PENDING = 'P',
  ACTIVE = 'A',
  DELETED = 'D',
}

export interface IUser {
  id: string;
  name: string;
  nickName?: string;
  status: UserStatus;
}
