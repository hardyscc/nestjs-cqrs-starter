import { ICommand } from '@nestjs/cqrs';
import { CreateAccountInput } from '../../../input/create-account.input';

export class CreateAccountCommand implements ICommand {
  constructor(public readonly input: CreateAccountInput) {}
}
