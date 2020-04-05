import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AccountService } from '../../../service/account.service';
import { CreateAccountCommand } from '../impl/create-account.command';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand> {
  constructor(
    private readonly accountService: AccountService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateAccountCommand) {
    console.log(`Async ${this.constructor.name}...`, command.constructor.name);
    const { input } = command;
    const account = this.publisher.mergeObjectContext(
      await this.accountService.create(input),
    );
    account.createAccount();
    account.commit();
    return account;
  }
}
