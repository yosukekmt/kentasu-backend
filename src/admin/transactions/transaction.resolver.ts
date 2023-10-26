import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { TransactionType } from './transaction.types';

@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [TransactionType])
  async transactions(
    @Context('req') req: any,
    @Args('skip', { defaultValue: 0, type: () => Number }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Number }) take: number,
  ): Promise<TransactionType[]> {
    const items = await this.prisma.transaction.findMany({
      include: { user: true },
      skip: skip,
      take: Math.min(1200, take),
    });
    return TransactionType.fromAry(items);
  }
}
