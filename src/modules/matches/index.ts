import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesEntity } from './entities';
import { MatchesController } from './controller';
import { MatchesRepositoryToken, MatchesServiceToken } from './interface';
import { MatchesRepository } from './repository';
import { MatchesService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchesEntity])],
  controllers: [MatchesController],
  providers: [
    MatchesService,
    MatchesRepository,
    {
      provide: MatchesRepositoryToken,
      useClass: MatchesRepository,
    },
    {
      provide: MatchesServiceToken,
      useClass: MatchesService,
    },
  ],
  exports: [
    MatchesService,
    MatchesRepository,
    MatchesRepositoryToken,
    MatchesServiceToken,
  ],
})
export class MatchesModule {}
