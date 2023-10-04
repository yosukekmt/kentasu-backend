import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, PrismaService],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('users', () => {
    let item: User;

    beforeEach(async () => {
      const data = {
        email: faker.helpers.unique(faker.internet.email),
      };
      item = await prisma.user.create({ data });
    });

    it('should contain correct id', async () => {
      const result = await resolver.users();
      expect(result.map((i) => i.id)).toContain(item.id);
    });

    it('should contain correct email', async () => {
      const result = await resolver.users();
      expect(result.map((i) => i.email)).toContain(item.email);
    });
  });
});
