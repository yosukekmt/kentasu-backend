import { UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { ResultType } from './result.types';

@Resolver(() => ResultType)
export class resultResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [ResultType])
  async results(
    @Context('req') req: any,
    @Args('skip', { defaultValue: 0, type: () => Number }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Number }) take: number,
  ): Promise<ResultType[]> {
    const items = await this.prisma.result.findMany({
      include: { user: true },
      skip: skip,
      take: Math.min(1200, take),
    });
    return ResultType.fromAry(items);
  }
}
