import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSwipesDto, UpdateSwipesDto } from '../dto';
import { SwipesEntity } from '../entities';
import {
  ISwipesRepository,
  ISwipesService,
  SwipesRepositoryToken,
} from '../interface';
import { SwipeActionEnum } from 'common/enum';
import { MatchesServiceToken, IMatchesService } from 'modules/matches/interface';

@Injectable()
export class SwipesService implements ISwipesService {
  constructor(
    @Inject(SwipesRepositoryToken)
    private readonly swipesRepository: ISwipesRepository,
    @Inject(MatchesServiceToken)
    private readonly matchesService: IMatchesService,
  ) {}

  async create(dto: CreateSwipesDto): Promise<SwipesEntity> {
    return this.swipesRepository.create(dto);
  }

  async getCountSwipesByUserIdByDate(
    userId: number,
    date: Date,
  ): Promise<number> {
    return this.swipesRepository.getCountSwipesByUserIdByDate(userId, date);
  }

  async update(dto: UpdateSwipesDto): Promise<void> {
    const swipes = await this.swipesRepository.getLastUserSwipe(
      dto?.swiperId,
    );
    if (!swipes) {
      throw new NotFoundException('Swipes not found');
    }
    if (swipes.swiperId !== dto.swiperId) {
      throw new NotFoundException('Swipes not found');
    }

    if(dto.action === SwipeActionEnum.RIGHT){
      const checkSwipes = await this.swipesRepository.getBySwipedIdAndSwiperId(
        swipes.swiperId,
        swipes.swipedId,
      );
      if(checkSwipes && checkSwipes.action === SwipeActionEnum.RIGHT){
        await this.matchesService.create({
          userOneId: swipes.swiperId,
          userTwoId: swipes.swipedId,
        });
      }
    }
    return this.swipesRepository.update(swipes.id, dto);
  }
}
