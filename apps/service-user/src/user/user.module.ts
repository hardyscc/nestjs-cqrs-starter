import { AccountCreatedEvent } from '@hardyscc/common/event/account-created.event';
import {
  EventStoreModule,
  EventStoreSubscriptionType,
} from '@juicycleff/nestjs-event-store';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivateUserHandler } from './cqrs/command/handler/activate-user.handler';
import { CreateUserHandler } from './cqrs/command/handler/create-user.handler';
import { CreateUserSaga } from './cqrs/saga/create-user.saga';
import { User } from './model/user.model';
import { UserResolver } from './resolver/user.resolver';
import { UserService } from './service/user.service';

const CommandHandlers = [CreateUserHandler, ActivateUserHandler];
const Sagas = [CreateUserSaga];

@Module({
  imports: [
    CqrsModule,
    EventStoreModule.registerFeature({
      type: 'event-store',
      featureStreamName: '$svc-user',
      subscriptions: [
        {
          type: EventStoreSubscriptionType.Persistent,
          stream: '$svc-account',
          persistentSubscriptionName: 'user',
        },
      ],
      eventHandlers: {
        AccountCreatedEvent: (data) => new AccountCreatedEvent(data),
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserResolver, ...CommandHandlers, ...Sagas],
})
export class UserModule {}
