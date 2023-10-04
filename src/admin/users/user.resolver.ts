import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from './user.types';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [UserType])
  async users(): Promise<UserType[]> {
    const items = await this.prisma.user.findMany();
    return items.map((item) => {
      return { id: item.id, email: item.email };
    });
  }
}
