import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import * as request from 'supertest';
import { FirebaseService } from '../src/admin/firebase/firebase.service';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let firebase: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, FirebaseService],
    }).compile();

    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    firebase = module.get<FirebaseService>(FirebaseService);
    await app.init();
  });

  describe('GraphQL', () => {
    let bearerToken: string;
    let firebaseUserId: string;
    let email: string;
    let spy: any;

    beforeEach(async () => {
      bearerToken = faker.string.alpha(32);
      firebaseUserId = faker.string.uuid();
      email = faker.helpers.unique(faker.internet.email);

      await prisma.admin.create({
        data: { email: email, firebaseUserId: firebaseUserId },
      });

      spy = jest
        .spyOn(firebase, 'findOneByIdToken')
        .mockImplementation(async (idToken: string) => {
          if (idToken !== bearerToken) throw new Error();

          const userData = { uid: firebaseUserId, email: email };
          const firebaseUser = {
            ...userData,
            toJSON: () => userData,
          } as UserRecord;
          return firebaseUser;
        });
    });

    afterEach(async () => {
      spy.mockRestore();
    });

    describe('users', () => {
      let item: User;

      beforeEach(async () => {
        const data = { email: faker.helpers.unique(faker.internet.email) };
        item = await prisma.user.create({ data });
      });

      it('should be successfull with bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/admin/graphql')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${bearerToken}`)
          .send('{"query": "{ users { id email } }"}');
        expect(resp.status).toEqual(200);
        expect(resp.body.errors).toBeUndefined();
        expect(resp.body.data.users.map((d) => d.id)).toContain(item.id);
      });

      it('should be Unauthorized with incorrect bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/admin/graphql')
          .set('Content-Type', 'application/json')
          .set('Authorization', 'Bearer INCORRECT_TOKEN')
          .send('{"query": "{ users { id email } }"}');
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });

      it('should be Unauthorized without bearer token', async () => {
        const resp = await request(app.getHttpServer())
          .post('/admin/graphql')
          .set('Content-Type', 'application/json')
          .send('{"query": "{ users { id email } }"}');
        expect(resp.status).toEqual(200);
        expect(resp.body.errors[0].message).toEqual('Unauthorized');
      });
    });
  });
});