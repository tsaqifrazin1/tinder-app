import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'modules/app.module';
import { HttpExceptionFilter, QueryFailedFilter } from 'src/filter';
import * as request from 'supertest';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { UtilService } from 'utils/service/utils.service';

describe('Profiles with preferences (e2e)', () => {
  let app: INestApplication;

  let token: string;

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

  describe('/ (Preferences)', () => {
    it('should return 201 and user preferences', async () => {
      return request(app.getHttpServer())
        .post('/api/users/preferences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ageMin: 20,
          ageMax: 30,
          preferredGender: 'F',
        })
        .then((response) => {
          expect(response.status).toBe(201);
        });
    });
  });

  describe('/ (Profile)', () => {
    it('should return 201 and user profile', async () => {
      let status = true;
      while (status) {
        await request(app.getHttpServer())
          .get('/api/users/profiles')
          .set('Authorization', `Bearer ${token}`)
          .then((response) => {
            if (response.status !== 200) {
              status = false;
            } else {
              expect(response.status).toBe(200);
              expect(
                UtilService.calculateAge(response.body.data.dob),
              ).toBeLessThanOrEqual(30);
              expect(
                UtilService.calculateAge(response.body.data.dob),
              ).toBeGreaterThanOrEqual(20);
            }
          });
      }
    });
  });
});
