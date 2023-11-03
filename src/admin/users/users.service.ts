import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(id: string): Promise<User | undefined> {
    const item = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!item) return;

    return item;
  }

  async findAll(): Promise<User[]> {
    const items = await this.prismaService.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items;
  }
}
