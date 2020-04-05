import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAccountInput {
  @Field()
  name: string;

  @Field(() => ID)
  userId: string;
}
