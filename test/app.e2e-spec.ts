import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import dataSource from '../src/db/data-source';
import * as cookieParser from 'cookie-parser';
import { configuration } from '../src/config/configuration';
import { readFile } from 'fs/promises';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    const appConfig = configuration().app;
    const secret = appConfig.secret;

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.use(cookieParser(secret));
    await app.init();
  });
  afterAll(async () => {
    //delete all data
    await dataSource.initialize();
    await dataSource.createQueryRunner().query(`DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;`);

    await app.close();
  });

  let token: string;
  describe('Auth and User tests', () => {
    it('/auth/check (GET)', () => {
      return request(app.getHttpServer()).get('/auth/check').expect(401);
    });
    it('/seed (GET)', () => {
      return request(app.getHttpServer()).get('/seed').expect(200);
    });
    it('/auth/login (POST)', () => {
      return (
        request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'staff3@staff.com',
            password: 'secret',
          })
          .expect(201)
          // expect cookie to be set
          .expect('set-cookie', /token=.+/)
          .expect((res) => {
            token = res.headers['set-cookie'][0];
            //extract token from cookie
            token = token.split(';')[0].split('=')[1];
          })
      );
    });
    it('/auth/check (GET)', () => {
      return (
        request(app.getHttpServer())
          .get('/auth/check')
          // set cookie
          .set('Cookie', [`token=${token}`])
          .expect(200)
      );
    });

    it('/users/getme (GET)', () => {
      return (
        request(app.getHttpServer())
          .get('/users/me')
          // set cookie
          .set('Cookie', [`token=${token}`])
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
          })
      );
    });
  });
  // form test
  describe('Form tests', () => {
    let advanceForm: JSON;
    readFile(__dirname + '/assets/advance_form.json', 'utf-8').then((data) => {
      advanceForm = data as unknown as JSON;
    });
    it('/forms/advance (GET)', () => {
      return (
        request(app.getHttpServer())
          .get('/forms/advance')
          // set cookie
          .set('Cookie', [`token=${token}`])
          .expect(403)
      );
    });
    it('/forms/retirement (GET)', () => {
      return (
        request(app.getHttpServer())
          .get('/forms/retirement')
          // set cookie
          .set('Cookie', [`token=${token}`])
          .expect(403)
      );
    });
    it('/forms/advance (POST)', () => {
      return request(app.getHttpServer())
        .post('/forms/advance')
        .set('Cookie', [`token=${token}`])
        .set('content-type', 'form-data')
        .send(advanceForm)
        .expect((res) => {
          console.log(advanceForm);
          console.log(res.body);
        });
    });
  });
});
