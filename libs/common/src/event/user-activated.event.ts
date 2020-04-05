import { IEvent } from '@nestjs/cqrs';
import { IUser } from '../interface/user.interface';

export class UserActivatedEvent implements IEvent {
  constructor(public readonly user: IUser) {}
}
