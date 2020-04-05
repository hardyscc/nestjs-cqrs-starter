import { ICommand } from '@nestjs/cqrs';

export class ActivateUserCommand implements ICommand {
  constructor(public readonly id: string) {}
}
