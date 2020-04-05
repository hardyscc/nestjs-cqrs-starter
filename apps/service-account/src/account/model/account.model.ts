import { AccountCreatedEvent } from '@hardyscc/common/event/account-created.event';
import { IAccount } from '@hardyscc/common/interface/account.interface';
import { AggregateRoot } from '@nestjs/cqrs';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Directive(`@key(fields: "id")`)
@ObjectType()
@Entity('ACCOUNT')
export class Account extends AggregateRoot implements IAccount {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ default: 0 })
  balance: number;

  @Field(() => ID)
  @Column()
  userId: string;

  createAccount() {
    this.apply(new AccountCreatedEvent(this));
  }
}
