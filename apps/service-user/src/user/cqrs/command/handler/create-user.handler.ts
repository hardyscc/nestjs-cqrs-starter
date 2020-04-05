import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserService } from '../../../service/user.service';
import { CreateUserCommand } from '../impl/create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
    console.log(`Async ${this.constructor.name}...`, command.constructor.name);
    const { input } = command;
    const user = this.publisher.mergeObjectContext(
      await this.userService.create(input),
    );
    user.createUser();
    user.commit();
    return user;
  }
}
