import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { setupSwagger } from './utils';
import { HttpExceptionFilter, QueryFailedFilter } from './filter';
import { useContainer } from 'class-validator';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('api');
  app.enable('trust proxy');
  app.use(
    helmet.default({
      contentSecurityPolicy: false,
    }),
  );
  app.use(compression());
  app.use(morgan('tiny'));
  setupSwagger(app);

  const reflector = app.get(Reflector);
  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new QueryFailedFilter(reflector),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  await app
    .listen(port, '0.0.0.0')
    .then(() =>
      console.log(
        `Server is running on port ${
          configService.get<number>('PORT') ?? 3000
        }`,
      ),
    );
}
bootstrap();
