import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  describe('/ (GET)', () => {
    it('should be successfull', async () => {
      const resp = await request(app.getHttpServer())
        .get('/')
        .set('Content-Type', 'application/json');
      expect(resp.status).toEqual(200);
      expect(resp.body.status).toEqual('ok');
    });
  });

  describe('/liveness_check (GET)', () => {
    it('should be successfull', async () => {
      const resp = await request(app.getHttpServer())
        .get('/liveness_check')
        .set('Content-Type', 'application/json');
      expect(resp.status).toEqual(200);
      expect(resp.body.status).toEqual('up');
    });
  });

  describe('/readiness_check (GET)', () => {
    it('should be successfull', async () => {
      const resp = await request(app.getHttpServer())
        .get('/readiness_check')
        .set('Content-Type', 'application/json');
      expect(resp.status).toEqual(200);
      expect(resp.body.status).toEqual('up');
    });
  });
});
