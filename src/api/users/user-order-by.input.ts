import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserOrderByInput {
  @Field()
  field: 'email' | 'wallet' | 'createdAt' | 'updatedAt' | 'deletedAt';
  @Field()
  direction: 'asc' | 'desc';
}
