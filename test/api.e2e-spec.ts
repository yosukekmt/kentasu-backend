import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Result, Transaction, User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Api (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();
  });

  describe('GraphQL', () => {
    let bearerToken: string;

    beforeEach(async () => {
      bearerToken = faker.string.alpha(32);

      jest.mock('../src/api/auth/jwt.strategy', () => {
        return {
          JwtStrategy: jest.fn().mockImplementation(() => {
            return {
              validate: jest.fn().mockImplementation((payload) => {
                console.log('mocked validate');
                if (payload && payload.someCondition) {
                  return { userId: 'someUserIdBasedOnCondition' };
                } else {
                  return { userId: 'someOtherUserId' };
                }
              }),
              verify: jest.fn().mockImplementation((payload) => {
                console.log('mocked verify');
              }),
              _verify: jest.fn().mockImplementation((payload) => {
                console.log('mocked _verify');
              }),
            };
          }),
        };
      });
    });
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
          .set('Authorization', `Bearer ${bearerToken}`)
          .send({ query: '{ results { id resultType } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.results.map((d) => d.id)).toContain(item.id);
      });

      it('should be Unauthorized with incorrect bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer INCORRECT_TOKEN')
          .send({ query: '{ results { id resultType } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });

      it('should be Unauthorized without bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({ query: '{ results { id resultType } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
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

      it('should be successfull with bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          //.set('Authorization', `Bearer ${bearerToken}`)
          .send({ query: '{ transactions { id txHash } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.transactions.map((d) => d.id)).toContain(item.id);
      });

      it('should be Unauthorized with incorrect bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          //.set('Authorization', 'Bearer INCORRECT_TOKEN')
          .send({ query: '{ transactions { id txHash } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });

      it('should be Unauthorized without bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({ query: '{ transactions { id txHash } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
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

      it('should be successfull with bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          //          .set('Authorization', `Bearer ${bearerToken}`)
          .send({
            query:
              '{ users(orderBy: {field: "createdAt", direction: "desc"}) { id email createdAt results(orderBy: {field: "createdAt", direction: "desc"}) { id } transactions(orderBy: {field: "createdAt", direction: "desc"}) { id } } }',
          });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.users.map((d) => d.id)).toContain(item.id);
      });

      it('should be Unauthorized with incorrect bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer INCORRECT_TOKEN')
          .send({ query: '{ users { id email } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });

      it('should be Unauthorized without bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/api/graphql')
          .set('Content-Type', 'application/json')
          .send({ query: '{ users { id email } }' });
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });
    });
  });
});
