import { Inject, Injectable } from '@nestjs/common';
import { CreateMatchesDto } from '../dto';
import { MatchesEntity } from '../entities';
import {
  IMatchesRepository,
  IMatchesService,
  MatchesRepositoryToken,
} from '../interface';

@Injectable()
export class MatchesService implements IMatchesService {
  constructor(
    @Inject(MatchesRepositoryToken)
    private readonly matchesRepository: IMatchesRepository,
  ) {}

  async create(dto: CreateMatchesDto): Promise<MatchesEntity> {
    return this.matchesRepository.create(dto);
  }

  async getMatchesByUserId(userId: number): Promise<MatchesEntity[]> {
    return this.matchesRepository.getMatchesByUserId(userId);
  }
}
