import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransactionOrderByInput {
  @Field()
  field:
    | 'txHash'
    | 'fromWallet'
    | 'toWallet'
    | 'amountWei'
    | 'gasWei'
    | 'blockProducedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt';
  @Field()
  direction: 'asc' | 'desc';
}
