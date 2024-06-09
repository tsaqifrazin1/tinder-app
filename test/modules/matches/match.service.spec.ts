import { TestBed } from '@automock/jest';
import { MatchesEntity } from 'modules/matches/entities';
import {
  IMatchesRepository,
  MatchesRepositoryToken,
} from 'modules/matches/interface';
import { MatchesRepository } from 'modules/matches/repository';
import { MatchesService } from 'modules/matches/service';

describe('MatchesService', () => {
  let matchesService: MatchesService;
  let matchesRepository: jest.Mocked<IMatchesRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(MatchesService).compile();
    matchesService = unit;
    matchesRepository = unitRef.get<MatchesRepository>(MatchesRepositoryToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(matchesService).toBeDefined();
    expect(matchesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a swipe', async () => {
      const swipe = { id: 1 };
      matchesRepository.create.mockResolvedValue(swipe as any);

      const result = await matchesService.create({} as any);

      expect(result).toBe(swipe);
    });
  });

  describe('getCountMatchesByUserIdByDate', () => {
    it('should return a count of matches', async () => {
      const matches = [{ id: 1 }];
      matchesRepository.getMatchesByUserId.mockResolvedValue(
        matches as MatchesEntity[],
      );

      const result = await matchesService.getMatchesByUserId(1);

      expect(result).toBe(matches);
    });
  });
});
