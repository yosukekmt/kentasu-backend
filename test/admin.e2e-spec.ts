import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
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
    describe('users', () => {
      let item: User;

      beforeEach(async () => {
        const data = { email: faker.helpers.unique(faker.internet.email) };
        item = await prisma.user.create({ data });
      });

      it('should be successfull', async () => {
        const resp = await request(app.getHttpServer())
          .post('/admin/graphql')
          .set('Content-Type', 'application/json')
          .send('{"query": "{ users { id email } }"}');
        expect(resp.status).toEqual(200);
        expect(resp.body.data.users.map((d) => d.id)).toContain(item.id);
      });
    });
  });
});
