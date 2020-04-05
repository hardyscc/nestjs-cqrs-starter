import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@Directive('@extends')
@Directive(`@key(fields: "id")`)
@ObjectType()
export class User {
  @Directive('@external')
  @Field(() => ID)
  id: string;
}
