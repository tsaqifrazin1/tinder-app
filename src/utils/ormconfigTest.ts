import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const configService = new ConfigService();
const port = configService.get<number>('DATABASE_PORT') ?? 5432;
export const appDataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: port,
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database:
    configService.get('DATABASE_DB_TEST') ??
    configService.get('DATABASE_DB') + '_test',
  schema: configService.get('DATABASE_SCHEMA'),
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['src/modules/**/*{.entity,.index}{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
});
