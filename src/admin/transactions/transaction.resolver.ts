import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { TransactionType } from './transaction.types';

@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [TransactionType])
  async transactions(@Context('req') req: any): Promise<TransactionType[]> {
    const items = await this.prisma.transaction.findMany();
    return items.map((item) => {
      return {
        id: item.id,
        txHash: item.txHash,
        fromWallet: item.fromWallet,
        toWallet: item.toWallet,
        amountWei: item.amountWei.toString(),
        gasWei: item.gasWei.toString(),
        blockProducedAt: item.blockProducedAt,
      };
    });
  }
}
