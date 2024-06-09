import { TestBed } from '@automock/jest';
import {
  IMatchesService,
  MatchesServiceToken,
} from 'modules/matches/interface';
import { MatchesService } from 'modules/matches/service';
import {
  ISwipesRepository,
  SwipesRepositoryToken,
} from 'modules/swipes/interface';
import { SwipesRepository } from 'modules/swipes/repository';
import { SwipesService } from 'modules/swipes/service';

describe('SwipesService', () => {
  let swipesService: SwipesService;
  let swipesRepository: jest.Mocked<ISwipesRepository>;
  let matchesService: jest.Mocked<IMatchesService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(SwipesService).compile();
    swipesService = unit;
    swipesRepository = unitRef.get<SwipesRepository>(SwipesRepositoryToken);
    matchesService = unitRef.get<MatchesService>(MatchesServiceToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(swipesService).toBeDefined();
    expect(swipesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a swipe', async () => {
      const swipe = { id: 1 };
      swipesRepository.create.mockResolvedValue(swipe as any);

      const result = await swipesService.create({} as any);

      expect(result).toBe(swipe);
    });
  });

  describe('getCountSwipesByUserIdByDate', () => {
    it('should return a count of swipes', async () => {
      const count = 1;
      swipesRepository.getCountSwipesByUserIdByDate.mockResolvedValue(count);

      const result = await swipesService.getCountSwipesByUserIdByDate(
        1,
        new Date(),
      );

      expect(result).toBe(count);
    });
  });

  describe('update', () => {
    it('should update a swipe', async () => {
      const swipe = { id: 1, swiperId: 1, swipedId: 2, action: 'RIGHT' };
      const dto = { id: 1, swiperId: 1, swipedId: 2, action: 'RIGHT' };
      swipesRepository.getLastUserSwipe.mockResolvedValue(swipe as any);
      swipesRepository.getBySwipedIdAndSwiperId.mockResolvedValue(swipe as any);

      await swipesService.update(dto as any);

      expect(swipesRepository.update).toBeCalledTimes(1);
    });

    it('should throw NotFoundException if swipes null', async () => {
      const swipe = { id: 1, swiperId: 1, swipedId: 2, action: 'RIGHT' };
      const dto = { id: 1, swiperId: 1, swipedId: 2, action: 'RIGHT' };
      swipesRepository.getLastUserSwipe.mockResolvedValue(null);
      swipesRepository.getBySwipedIdAndSwiperId.mockResolvedValue(swipe as any);

      await expect(swipesService.update(dto as any)).rejects.toThrowError(
        'Swipes not found',
      );
    });

    it('should throw NotFoundException if swiperId not match', async () => {
      const swipe = { id: 1, swiperId: 2, swipedId: 2, action: 'RIGHT' };
      const dto = { id: 1, swiperId: 1, swipedId: 2, action: 'RIGHT' };
      swipesRepository.getLastUserSwipe.mockResolvedValue(swipe as any);
      swipesRepository.getBySwipedIdAndSwiperId.mockResolvedValue(swipe as any);

      await expect(swipesService.update(dto as any)).rejects.toThrowError(
        'Swipes not found',
      );
    });
  });
});
