import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Result, Transaction, User } from '@prisma/client';
import * as request from 'supertest';
import { AuthzStrategy } from '../src/api/authz/authz.strategy';
import { GqlAuthGuard } from '../src/api/authz/gql-auth.guard';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Api (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockAuthzStrategy = {
      validateToken: jest
        .fn()
        .mockReturnValue({ userId: 1, username: 'testUser' }),
    };

    const mockGqlAuthGuard = {
      canActivate: jest.fn().mockReturnValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    })
      .overrideProvider(AuthzStrategy)
      .useValue(mockAuthzStrategy)
      .overrideGuard(GqlAuthGuard)
      .useValue(mockGqlAuthGuard)
      .compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  describe('GraphQL', () => {
    describe('results', () => {
      let item: Result;

      beforeEach(async () => {
        const data = {
          resultType: 'medical_checkup',
          user: {
            create: {
              email: faker.internet.email(),
              walletAddress: faker.finance.ethereumAddress(),
              walletPrivateKeyEncrypted: 'hoge',
              auth0UserId: faker.string.uuid(),
            },
          },
        };
        item = await prisma.result.create({ data });
      });

      it('should be successfull with bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({ query: '{ results { id resultType } }' });
        console.log(resp.body);
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.results.map((d) => d.id)).toContain(item.id);
      });
    });

    describe('transactions', () => {
      let item: Transaction;

      beforeEach(async () => {
        const data = {
          txHash: faker.finance.ethereumAddress(),
          fromWallet: faker.finance.ethereumAddress(),
          toWallet: faker.finance.ethereumAddress(),
          amountWei: new Prisma.Decimal(
            faker.number.float({
              min: 1,
              max: 10_000_000_000_000_000_000 /* 10Eth */,
            }),
          ),
          gasWei: new Prisma.Decimal(
            faker.number.float({
              min: 1,
              max: 1_000_000_000 /* 1Gwei */,
            }),
          ),
          blockProducedAt: faker.date.recent(),
          user: {
            create: {
              auth0UserId: faker.string.uuid(),
              walletAddress: faker.finance.ethereumAddress(),
              walletPrivateKeyEncrypted: 'hoge',
              email: faker.internet.email(),
            },
          },
        };
        item = await prisma.transaction.create({ data });
      });

      it('should be successfull', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({ query: '{ transactions { id txHash } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.transactions.map((d) => d.id)).toContain(item.id);
      });
    });

    describe('users', () => {
      let item: User;

      beforeEach(async () => {
        const data = {
          email: faker.internet.email(),
          walletAddress: faker.finance.ethereumAddress(),
          walletPrivateKeyEncrypted: 'hoge',
          auth0UserId: faker.string.uuid(),
        };
        item = await prisma.user.create({ data });
      });

      it('should be successfull', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({
            query:
              '{ users(orderBy: {field: "createdAt", direction: "desc"}) { id email createdAt results(orderBy: {field: "createdAt", direction: "desc"}) { id } transactions(orderBy: {field: "createdAt", direction: "desc"}) { id } } }',
          });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.users.map((d) => d.id)).toContain(item.id);
      });
    });
  });
});
