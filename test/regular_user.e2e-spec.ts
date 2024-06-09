import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'modules/app.module';
import { UserEntity } from 'modules/user/entitites';
import { HttpExceptionFilter, QueryFailedFilter } from 'src/filter';
import * as request from 'supertest';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('Regular User (e2e)', () => {
  let app: INestApplication;

  let token: string;

  let lastProfile: UserEntity;

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
          username: 'user1',
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
          expect(response.body.data).toHaveProperty('token');
          token = response.body.data.token;
        });
    });

    it('should return 400 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          username: 'user2',
          password: 'password1',
        })
        .then((response) => {
          expect(response.status).toBe(400);
        });
    });
  });

  describe('/ (Profile)', () => {
    it('should return 201 and user profile', async () => {
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .get('/api/users/profiles')
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            expect(response.status).toBe(200);
            if (i === 9) {
              lastProfile = response.body.data;
            }
          });
      }
    });

    it('should return 404 and user profile', async () => {
      return request(app.getHttpServer())
        .get('/api/users/profiles')
        .set('Authorization', `Bearer ${token}`)
        .then((response) => {
          expect(response.status).toBe(404);
        });
    });
  });

  describe('/ (Swipe)', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .patch('/api/users/swipes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          swipedId: lastProfile.id,
          action: 'RIGHT',
        })
        .then((response) => {
          expect(response.status).toBe(200);
        });
    });
  });
});
