import { TestBed } from "@automock/jest";
import { ISwipesService, SwipesServiceToken } from "modules/swipes/interface";
import { SwipesService } from "modules/swipes/service";
import { IUserPreferencesRepository, UserPreferencesRepositoryToken } from "modules/user_preferences/interface";
import { UserPreferencesRepository } from "modules/user_preferences/repository";
import { UserPreferencesService } from "modules/user_preferences/service";

describe('UserPreferencesService', () => {
  let userPreferencesService: UserPreferencesService;
  let userPreferencesRepository: jest.Mocked<IUserPreferencesRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserPreferencesService).compile();
    userPreferencesService = unit;
    userPreferencesRepository = unitRef.get<UserPreferencesRepository>(
      UserPreferencesRepositoryToken,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userPreferencesService).toBeDefined();
    expect(userPreferencesRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user preferences', async () => {
      const userPreferences = { id: 1 };
      userPreferencesRepository.create.mockResolvedValue(userPreferences as any);

      const result = await userPreferencesService.create({} as any);

      expect(result).toBe(userPreferences);
    });
  });

  describe('getById', () => {
    it('should return a user preferences', async () => {
      const userPreferences = { id: 1 };
      userPreferencesRepository.getById.mockResolvedValue(userPreferences as any);

      const result = await userPreferencesService.getById(1);

      expect(result).toBe(userPreferences);
    });
  });

  describe('update', () => {
    it('should update a user preferences', async () => {
      const userPreferences = { id: 1 };
      userPreferencesRepository.getById.mockResolvedValue(userPreferences as any);

      await userPreferencesService.update(1, {} as any);

      expect(userPreferencesRepository.update).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      userPreferencesRepository.getById.mockResolvedValue(null);

      await expect(userPreferencesService.update(1, {} as any)).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should delete a user preferences', async () => {
      const userPreferences = { id: 1 };
      userPreferencesRepository.getById.mockResolvedValue(userPreferences as any);

      await userPreferencesService.delete(1);

      expect(userPreferencesRepository.delete).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      userPreferencesRepository.getById.mockResolvedValue(null);

      await expect(userPreferencesService.delete(1)).rejects.toThrowError();
    });
  });
});
