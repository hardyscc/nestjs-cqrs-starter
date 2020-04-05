import { NotFoundException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { CreateUserCommand } from '../cqrs/command/impl/create-user.command';
import { CreateUserInput } from '../input/create-user.input';
import { User } from '../model/user.model';
import { UserService } from '../service/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly commandBus: CommandBus,
  ) {}

  @Query(() => User)
  async user(@Args('id') id: string) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(id);
    }
    return user;
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return await this.commandBus.execute(new CreateUserCommand(input));
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id') id: string) {
    return this.userService.remove(id);
  }

  @Query(() => [User])
  users() {
    return this.userService.find();
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.userService.findOneById(reference.id);
  }
}
