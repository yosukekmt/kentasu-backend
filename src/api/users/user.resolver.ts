import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard } from '../authz/gql-auth.guard';
import { ResultOrderByInput } from '../results/result-order-by.input';
import { ResultType } from '../results/result.types';
import { TransactionOrderByInput } from '../transactions/transaction-order-by.input';
import { TransactionType } from '../transactions/transaction.types';
import { UserOrderByInput } from './user-order-by.input';
import { UserType } from './user.types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [UserType])
  async users(
    @Context('req') req: any,
    @Args('orderBy', {
      defaultValue: { field: 'createdAt', direction: 'desc' },
    })
    orderBy: UserOrderByInput,
    @Args('skip', { defaultValue: 0, type: () => Int }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Int }) take: number,
  ): Promise<UserType[]> {
    console.log('UserResolver');
    console.log(req.user);
    const items = await this.prisma.user.findMany({
      orderBy: { [orderBy.field]: orderBy.direction },
      skip: skip,
      take: Math.min(1200, take),
    });
    return UserType.fromAry(items);
  }

  @ResolveField(() => [ResultType])
  async results(
    @Parent() user: UserType,
    @Args('orderBy', {
      defaultValue: { field: 'createdAt', direction: 'desc' },
    })
    orderBy: ResultOrderByInput,
    @Args('skip', { defaultValue: 0, type: () => Int }) skip: number,
    @Args('take', { defaultValue: 12, type: () => Int }) take: number,
  ) {
    const items = await this.prisma.result.findMany({
      where: { userId: user.id },
      include: { user: true },
      orderBy: { [orderBy.field]: orderBy.direction },
      skip: skip,
      take: Math.min(120, take),
    });
    return ResultType.fromAry(items);
  }

  @ResolveField(() => [TransactionType])
  async transactions(
    @Parent() user: UserType,
    @Args('orderBy', {
      defaultValue: { field: 'createdAt', direction: 'desc' },
    })
    orderBy: TransactionOrderByInput,
    @Args('skip', { defaultValue: 0, type: () => Int }) skip: number,
    @Args('take', { defaultValue: 12, type: () => Int }) take: number,
  ) {
    const items = await this.prisma.transaction.findMany({
      where: { userId: user.id },
      include: { user: true },
      orderBy: { [orderBy.field]: orderBy.direction },
      skip: skip,
      take: Math.min(120, take),
    });
    return TransactionType.fromAry(items);
  }
}
