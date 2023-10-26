import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TransactionType {
  @Field(() => ID)
  id: string;

  @Field()
  txHash: string;

  @Field()
  fromWallet: string;

  @Field()
  toWallet: string;

  @Field()
  amountWei: string | undefined;

  @Field()
  gasWei: string | undefined;

  @Field()
  blockProducedAt: Date | undefined;
}
