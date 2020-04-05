import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../../service/user.service';
import { ActivateUserCommand } from '../impl/activate-user.command';

@CommandHandler(ActivateUserCommand)
export class ActivateUserHandler
  implements ICommandHandler<ActivateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ActivateUserCommand) {
    console.log(`Async ${this.constructor.name}...`, command.constructor.name);
    const { id } = command;
    const user = this.publisher.mergeObjectContext(
      await this.userService.activate(id),
    );
    user.activateUser();
    user.commit();
    return user;
  }
}
