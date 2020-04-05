import { IEvent } from '@nestjs/cqrs';
import { IAccount } from '../interface/account.interface';

export class AccountCreatedEvent implements IEvent {
  constructor(public readonly account: IAccount) {}
}
