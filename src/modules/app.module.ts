import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { UserPreferencesModule } from './user_preferences';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        logging: configService.get('DATABASE_LOGGING') === 'true',
        logger: configService.get('DATABASE_LOGGING') === 'true' ? 'file' : null,
      }),
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    UserPreferencesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
