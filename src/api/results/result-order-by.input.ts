import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResultOrderByInput {
  @Field()
  field: 'createdAt' | 'updatedAt' | 'deletedAt';
  @Field()
  direction: 'asc' | 'desc';
}
