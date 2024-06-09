import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchesDto } from '../dto';
import { MatchesEntity } from '../entities';
import { IMatchesRepository } from '../interface';

@Injectable()
export class MatchesRepository implements IMatchesRepository {
  constructor(
    @InjectRepository(MatchesEntity)
    private readonly matchesRepository: Repository<MatchesEntity>,
  ) {}

  async create(dto: CreateMatchesDto): Promise<MatchesEntity> {
    const matches = this.matchesRepository.create(dto);
    return this.matchesRepository.save(matches);
  }

  async getMatchesByUserId(userId: number): Promise<MatchesEntity[]> {
    const queryBuilder = this.matchesRepository.createQueryBuilder('matches');
    queryBuilder.leftJoinAndSelect('matches.userOne', 'userOne');
    queryBuilder.leftJoinAndSelect('matches.userTwo', 'userTwo');
    queryBuilder.where('matches.userOneId = :userId', { userId });
    queryBuilder.orWhere('matches.userTwoId = :userId', { userId });

    return queryBuilder.getMany();
  }
}