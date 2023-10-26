import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { ResultType } from '../results/result.types';
import { UserType } from './user.types';
import { TransactionType } from '../transactions/transaction.types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [UserType])
  async users(
    @Context('req') req: any,
    @Args('skip', { defaultValue: 0, type: () => Number }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Number }) take: number,
  ): Promise<UserType[]> {
    const items = await this.prisma.user.findMany({
      skip: skip,
      take: Math.min(1200, take),
    });
    return UserType.fromAry(items);
  }

  @ResolveField(() => [ResultType])
  async results(
    @Parent() user: UserType,
    @Args('skip', { defaultValue: 0, type: () => Number }) skip: number,
    @Args('take', { defaultValue: 12, type: () => Number }) take: number,
  ) {
    const items = await this.prisma.result.findMany({
      where: { userId: user.id },
      include: { user: true },
      skip: skip,
      take: Math.min(120, take),
    });
    return ResultType.fromAry(items);
  }

  @ResolveField(() => [TransactionType])
  async transactions(
    @Parent() user: UserType,
    @Args('skip', { defaultValue: 0, type: () => Number }) skip: number,
    @Args('take', { defaultValue: 12, type: () => Number }) take: number,
  ) {
    const items = await this.prisma.transaction.findMany({
      where: { userId: user.id },
      include: { user: true },
      skip: skip,
      take: Math.min(120, take),
    });
    return TransactionType.fromAry(items);
  }
}
