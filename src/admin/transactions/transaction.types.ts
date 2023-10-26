import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Transaction, User } from '@prisma/client';
import { UserType } from '../users/user.types';

@ObjectType()
export class TransactionType {
  static fromObj(data: Transaction & { user: User }): TransactionType {
    return {
      id: data.id,
      txHash: data.txHash,
      fromWallet: data.fromWallet,
      toWallet: data.toWallet,
      amountWei: data.amountWei.toString(),
      gasWei: data.gasWei.toString(),
      blockProducedAt: data.blockProducedAt,
      userId: data.userId,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  }

  static fromAry(data: (Transaction & { user: User })[]): TransactionType[] {
    return data.map((d) => TransactionType.fromObj(d));
  }

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

  @Field()
  userId: string;

  @Field(() => UserType)
  user: UserType;
}
