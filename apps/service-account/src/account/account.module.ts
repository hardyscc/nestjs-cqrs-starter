import { UserActivatedEvent } from '@hardyscc/common/event/user-activated.event';
import { UserCreatedEvent } from '@hardyscc/common/event/user-created.event';
import {
  EventStoreSubscriptionType,
  NestjsEventStoreModule,
} from '@hardyscc/nestjs-event-store';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateAccountHandler } from './cqrs/command/handler/create-account.handler';
import { CreateUserSaga } from './cqrs/saga/create-user.saga';
import { Account } from './model/account.model';
import { AccountResolver } from './resolver/account.resolver';
import { UserResolver } from './resolver/user.resolver';
import { AccountService } from './service/account.service';

const CommandHandlers = [CreateAccountHandler];
const Sagas = [CreateUserSaga];

@Module({
  imports: [
    CqrsModule,
    NestjsEventStoreModule.forFeature({
      featureStreamName: '$svc-account',
      subscriptionsDelay: 2000,
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Persistent,
          stream: '$svc-user',
          persistentSubscriptionName: 'account',
        },
      ],
      eventHandlers: {
        UserCreatedEvent: (data) => new UserCreatedEvent(data),
        UserActivatedEvent: (data) => new UserActivatedEvent(data),
      },
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  providers: [
    AccountService,
    AccountResolver,
    UserResolver,
    ...CommandHandlers,
    ...Sagas,
  ],
})
export class AccountModule {}
