import { UserCreatedEvent } from '@hardyscc/common/event/user-created.event';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateAccountCommand } from '../command/impl/create-account.command';

@Injectable()
export class CreateUserSaga {
  @Saga()
  userCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserCreatedEvent),
      map(
        (event) =>
          new CreateAccountCommand({ name: 'Saving', userId: event.user.id }),
      ),
    );
  };
}
