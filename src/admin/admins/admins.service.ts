import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOneById(id: string): Promise<Admin | undefined> {
    const item = await this.prismaService.admin.findUnique({
      where: { id },
    });
    if (!item) return;

    return item;
  }

  async findAll(): Promise<Admin[]> {
    const items = await this.prismaService.admin.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return items;
  }
}
