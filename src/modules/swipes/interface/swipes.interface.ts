import { CreateSwipesDto, UpdateSwipesDto } from '../dto';
import { SwipesEntity } from '../entities';

/**
 * @description SwipesRepository Token
 */
export const SwipesRepositoryToken = Symbol('SwipesRepositoryToken');

/**
 * @description SwipesRepository Interface
 */
export interface ISwipesRepository {
  /**
   * @description Create Swipes to Database
   */
  create(dto: CreateSwipesDto): Promise<SwipesEntity>;

  /**
   * @description Get Swipes by Id from Database
   */
  getBySwipedIdAndSwiperId(
    swipedId: number,
    swiperId: number,
  ): Promise<SwipesEntity>;

  /**
   * @description Get Swipes by UserId By Date from Database
   */
  getCountSwipesByUserIdByDate(userId: number, date: Date): Promise<number>;

  /**
   * @description Get Last User Swipe from Database
   */
  getLastUserSwipe(userId: number): Promise<SwipesEntity>;

  /**
   * @description Update Swipes in Database
   */
  update(id: number, dto: UpdateSwipesDto): Promise<void>;
}

/**
 * @description Swipes Service Token
 */
export const SwipesServiceToken = Symbol('SwipesServiceToken');

/**
 * @description Swipes Service Interface
 */
export interface ISwipesService {
  /**
   * @description Create Swipes
   */
  create(dto: CreateSwipesDto): Promise<SwipesEntity>;

  /**
   * @description Get Swipes by UserId By Date from Database
   */
  getCountSwipesByUserIdByDate(userId: number, date: Date): Promise<number>;

  /**
   * @description Update Swipes
   */
  update(dto: UpdateSwipesDto): Promise<void>;
}
