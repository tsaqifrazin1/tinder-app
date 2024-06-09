import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSwipesDto, UpdateSwipesDto } from '../dto';
import { SwipesEntity } from '../entities';
import { ISwipesRepository } from '../interface';

@Injectable()
export class SwipesRepository implements ISwipesRepository {
  constructor(
    @InjectRepository(SwipesEntity)
    private readonly swipesRepository: Repository<SwipesEntity>,
  ) {}

  async create(dto: CreateSwipesDto): Promise<SwipesEntity> {
    const swipes = this.swipesRepository.create(dto);
    return this.swipesRepository.save(swipes);
  }

  async getBySwipedIdAndSwiperId(
    swipedId: number,
    swiperId: number,
  ): Promise<SwipesEntity> {
    const queryBuilder = this.swipesRepository.createQueryBuilder('swipes');
    queryBuilder.where('swipes.swipedId = :swipedId', { swipedId });
    queryBuilder.andWhere('swipes.swiperId = :swiperId', { swiperId });

    return queryBuilder.getOne();
  }

  async getLastUserSwipe(userId: number): Promise<SwipesEntity> {
    const queryBuilder = this.swipesRepository.createQueryBuilder('swipes');
    queryBuilder.where('swipes.swiper = :userId', { userId });
    queryBuilder.andWhere('swipes.swipedAt = :date', {
      date: new Date().toISOString().split('T')[0],
    });
    queryBuilder.orderBy('swipes.createdAt', 'DESC');

    return queryBuilder.getOne();
  }

  async getCountSwipesByUserIdByDate(
    userId: number,
    date: Date,
  ): Promise<number> {
    const queryBuilder = this.swipesRepository.createQueryBuilder('swipes');
    queryBuilder.where('swipes.swiper = :userId', { userId });
    queryBuilder.andWhere('swipes.swipedAt = :date', {
      date: date.toISOString().split('T')[0],
    });

    return queryBuilder.getCount();
  }

  async update(id: number, dto: UpdateSwipesDto): Promise<void> {
    await this.swipesRepository.update(id, dto);
  }
}
