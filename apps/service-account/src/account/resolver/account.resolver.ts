import {
  Args,
  Mutation,
  Parent,
  ResolveProperty,
  Resolver,
} from '@nestjs/graphql';
import { CreateAccountInput } from '../input/create-account.input';
import { Account } from '../model/account.model';
import { User } from '../model/user.model';
import { AccountService } from '../service/account.service';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  async createAccount(@Args('input') input: CreateAccountInput) {
    return this.accountService.create(input);
  }

  @ResolveProperty(() => User)
  user(@Parent() account: Account) {
    return { __typename: 'User', id: account.userId };
  }
}
