import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Account } from '../model/account.model';
import { User } from '../model/user.model';
import { AccountService } from '../service/account.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly accountService: AccountService) {}

  @ResolveProperty(() => [Account])
  accounts(@Parent() user: User) {
    return this.accountService.findByUserId(user.id);
  }
}
