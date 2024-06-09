import { CreateMatchesDto } from '../dto';
import { MatchesEntity } from '../entities';

/**
 * @description MatchesRepository Token
 */
export const MatchesRepositoryToken = Symbol('MatchesRepositoryToken');

/**
 * @description MatchesRepository Interface
 */
export interface IMatchesRepository {
  /**
   * @description Create Matches to Database
   */
  create(dto: CreateMatchesDto): Promise<MatchesEntity>;

  /**
   * @description Get Matches by User Id
   */
  getMatchesByUserId(userId: number): Promise<MatchesEntity[]>;
}

/**
 * @description Matches Service Token
 */
export const MatchesServiceToken = Symbol('MatchesServiceToken');

/**
 * @description Matches Service Interface
 */
export interface IMatchesService {
  /**
   * @description Create Matches
   */
  create(dto: CreateMatchesDto): Promise<MatchesEntity>;

  /**
   * @description Get Matches
   */
  getMatchesByUserId(userId: number): Promise<MatchesEntity[]>;
}
