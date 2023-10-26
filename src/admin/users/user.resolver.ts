import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { UserType } from './user.types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(BearerAuthGuard)
  @Query(() => [UserType])
  async users(@Context('req') req: any): Promise<UserType[]> {
    const items = await this.prisma.user.findMany();
    return items.map((item) => {
      return { id: item.id, email: item.email };
    });
  }
}
