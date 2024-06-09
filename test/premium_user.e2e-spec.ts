import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'modules/app.module';
import { SwipesEntity } from 'modules/swipes/entities';
import { HttpExceptionFilter, QueryFailedFilter } from 'src/filter';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('Regular User (e2e)', () => {
  let app: INestApplication;

  let token: string;
  let token2: string;

  beforeAll(async () => {
    initializeTransactionalContext();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');

    const reflector = app.get(Reflector);
    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new QueryFailedFilter(reflector),
    );
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT')
      ? configService.get<number>('PORT') + 1
      : 3001;
    await app
      .listen(port, '0.0.0.0')
      .then(() =>
        console.log(
          `Server is running on port ${
            configService.get<number>('PORT') ?? 3001
          }`,
        ),
      );
    await app.init();
  }, 15000);

  afterAll(async () => {
    await app.close();
  });

  describe('/ Login', () => {
    it('should return 201 and token', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'user10Subscribed',
          password: 'password',
        })
        .then((response) => {
          console.log(response.body);
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toHaveProperty('id');
          expect(response.body.data).toHaveProperty('username');
          expect(response.body.data).toHaveProperty('email');
          expect(response.body.data).toHaveProperty('firstname');
          expect(response.body.data).toHaveProperty('lastname');
          expect(response.body.data).toHaveProperty('gender');
          expect(response.body.data).toHaveProperty('isSubscribed');
          expect(response.body.data.isSubscribed).toEqual(true);
          expect(response.body.data).toHaveProperty('token');
          token = response.body.data.token;
        });
    });

    it('should return 400 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'user10',
          password: 'password1',
        })
        .then((response) => {
          expect(response.status).toBe(400);
        });
    });
  });

  describe('/ (Profile)', () => {
    it('should return 201 and user profile 100 times', async () => {
      for (let i = 1; i <= 97; i++) {
        await request(app.getHttpServer())
          .get('/api/users/profiles')
          .set('Authorization', `Bearer ${token}`)
          .then(async (response) => {
            expect(response.status).toBe(200);
            // swipe right for all premium users for testing purpose
            if (response.body.data.isSubscribed) {
              await request(app.getHttpServer())
                .patch('/api/users/swipes')
                .set('Authorization', `Bearer ${token}`)
                .send({
                  action: 'RIGHT',
                })
                .then((response) => {
                  expect(response.status).toBe(200);
                });
            }
          });
      }
    });
  });

  describe('/ (Swipe)', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .patch('/api/users/swipes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          action: 'RIGHT',
        })
        .then((response) => {
          expect(response.status).toBe(200);
        });
    });
  });

  describe('/ (Matches)', () => {
    it('should return 200 and matches', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'user20Subscribed',
          password: 'password',
        })
        .then((response) => {
          token2 = response.body.data.token;
        });

      //get 100 profiles
      for (let i = 1; i <= 2; i++) {
        await request(app.getHttpServer())
          .get('/api/users/profiles')
          .set('Authorization', `Bearer ${token2}`)
          .then(async (response) => {
            expect(response.status).toBe(200);
            // swipe right for all premium users for testing purpose
            if (response.body.data.isSubscribed) {
              await request(app.getHttpServer())
                .patch('/api/users/swipes')
                .set('Authorization', `Bearer ${token2}`)
                .send({
                  action: 'RIGHT',
                })
                .then((response) => {
                  expect(response.status).toBe(200);
                });
            }
          });
      }

      await request(app.getHttpServer())
        .get('/api/users/matches')
        .set('Authorization', `Bearer ${token2}`)
        .then((response) => {
          expect(response.status).toBe(200);
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body.data.length).toEqual(1);
          expect([
            response.body.data[0].userOne.username,
            response.body.data[0].userTwo.username,
          ]).toContain('user10Subscribed');
        });
    });
  });
});
