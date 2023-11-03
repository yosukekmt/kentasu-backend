import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { GqlAuthGuard } from '../authz/gql-auth.guard';
import { ResultOrderByInput } from './result-order-by.input';
import { ResultType } from './result.types';

@Resolver(() => ResultType)
export class ResultResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ResultType])
  async results(
    @Context('req') req: any,
    @Args('orderBy', {
      defaultValue: { field: 'createdAt', direction: 'desc' },
    })
    orderBy: ResultOrderByInput,
    @Args('skip', { defaultValue: 0, type: () => Int }) skip: number,
    @Args('take', { defaultValue: 120, type: () => Int }) take: number,
  ): Promise<ResultType[]> {
    const items = await this.prisma.result.findMany({
      include: { user: true },
      orderBy: { [orderBy.field]: orderBy.direction },
      skip: skip,
      take: Math.min(1200, take),
    });
    return ResultType.fromAry(items);
  }
}
