import { UserActivatedEvent } from '@hardyscc/common/event/user-activated.event';
import { UserCreatedEvent } from '@hardyscc/common/event/user-created.event';
import { IUser, UserStatus } from '@hardyscc/common/interface/user.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Directive(`@key(fields: "id")`)
@ObjectType()
@Entity('USER')
export class User extends AggregateRoot implements IUser {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickName?: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  createUser() {
    this.apply(new UserCreatedEvent(this));
  }

  activateUser() {
    this.apply(new UserActivatedEvent(this));
  }
}
