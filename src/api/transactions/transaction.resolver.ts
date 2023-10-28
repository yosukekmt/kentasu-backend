import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionOrderByInput } from './transaction-order-by.input';
import { TransactionType } from './transaction.types';

@Resolver(() => TransactionType)
export class TransactionResolver {
  constructor(private readonly prisma: PrismaService) {}

  //  @UseGuards(JwtAuthGuard)
  @Query(() => [TransactionType])
  async transactions(
    @Context('req') req: any,
    @Args('orderBy', {
      defaultValue: { field: 'createdAt', direction: 'desc' },
    })
    orderBy: TransactionOrderByInput,
    @Args('skip', { defaultValue: 0, type: () => Int }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Int }) take: number,
  ): Promise<TransactionType[]> {
    const items = await this.prisma.transaction.findMany({
      include: { user: true },
      orderBy: { [orderBy.field]: orderBy.direction },
      skip: skip,
      take: Math.min(1200, take),
    });
    return TransactionType.fromAry(items);
  }
}
