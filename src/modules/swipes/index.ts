import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwipesEntity } from './entities';
import { SwipesController } from './controller';
import { SwipesRepositoryToken, SwipesServiceToken } from './interface';
import { SwipesRepository } from './repository';
import { SwipesService } from './service';

@Module({
  imports: [TypeOrmModule.forFeature([SwipesEntity])],
  controllers: [SwipesController],
  providers: [
    SwipesService,
    SwipesRepository,
    {
      provide: SwipesRepositoryToken,
      useClass: SwipesRepository,
    },
    {
      provide: SwipesServiceToken,
      useClass: SwipesService,
    },
  ],
  exports: [
    SwipesService,
    SwipesRepository,
    SwipesRepositoryToken,
    SwipesServiceToken,
  ],
})
export class SwipesModule {}
