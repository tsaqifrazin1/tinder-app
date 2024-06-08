import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPreferencesEntity } from './entities';
import { UserPreferencesController } from './controller';
import { UserPreferencesRepositoryToken, UserPreferencesServiceToken } from './interface';
import { UserPreferencesRepository } from './repository';
import { UserPreferencesService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPreferencesEntity])],
  controllers: [UserPreferencesController],
  providers: [
    UserPreferencesService,
    UserPreferencesRepository,
    {
      provide: UserPreferencesRepositoryToken,
      useClass: UserPreferencesRepository,
    },
    {
      provide: UserPreferencesServiceToken,
      useClass: UserPreferencesService,
    },
  ],
  exports: [
    UserPreferencesService,
    UserPreferencesRepository,
    UserPreferencesRepositoryToken,
    UserPreferencesServiceToken,
  ],
})
export class UserPreferencesModule {}
