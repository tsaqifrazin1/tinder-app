import { TestBed } from '@automock/jest';
import { GenderEnum } from 'common/enum';
import { ISwipesService, SwipesServiceToken } from 'modules/swipes/interface';
import { SwipesService } from 'modules/swipes/service';
import { CreateUserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entitites';
import { IUserRepository, UserRepositoryToken } from 'modules/user/interface';
import { UserRepository } from 'modules/user/repository';
import { UserService } from 'modules/user/service';
import {
  IUserPreferencesService,
  UserPreferencesServiceToken,
} from 'modules/user_preferences/interface';
import { UserPreferencesService } from 'modules/user_preferences/service';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;
  let userPreferencesService: jest.Mocked<IUserPreferencesService>;
  let swipesService: jest.Mocked<ISwipesService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();
    userService = unit;
    userRepository = unitRef.get<UserRepository>(UserRepositoryToken);
    userPreferencesService = unitRef.get<UserPreferencesService>(
      UserPreferencesServiceToken,
    );
    swipesService = unitRef.get<SwipesService>(SwipesServiceToken);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const user = { id: 1 };
      userRepository.create.mockResolvedValue(user as UserEntity);

      const result = await userService.create({} as CreateUserDto);

      expect(result).toBe(user);
    });
  });

  describe('getById', () => {
    it('should return a user', async () => {
      const user = { id: 1 };
      userRepository.getById.mockResolvedValue(user as UserEntity);

      const result = await userService.getById(1);

      expect(result).toBe(user);
    });
  });

  describe('getByUsername', () => {
    it('should return a user', async () => {
      const user = { id: 1 };
      userRepository.getByUsername.mockResolvedValue(user as UserEntity);

      const result = await userService.getByUsername('username');

      expect(result).toBe(user);
    });
  });

  describe('getOtherProfile', () => {
    it('should return a user', async () => {
      const user = { id: 1, gender: GenderEnum.M, isSubscribed: false };
      const user2 = { id: 2 };

      userRepository.getById.mockResolvedValue(user as UserEntity);
      userPreferencesService.getById.mockResolvedValue(null);
      userRepository.getOtherProfile.mockResolvedValue(user2 as UserEntity);
      swipesService.create.mockResolvedValue(null);

      const result = await userService.getOtherProfile(1);
      expect(result).toBe(user2);
      expect(userRepository.getById).toBeCalledTimes(1);
      expect(userPreferencesService.getById).toBeCalledTimes(1);
      expect(userRepository.getOtherProfile).toBeCalledTimes(1);
      expect(userRepository.getOtherProfile).toBeCalledWith(1, {
        ageMax: undefined,
        ageMin: undefined,
        preferredGender: GenderEnum.F,
      });
      expect(swipesService.create).toBeCalledTimes(1);
    });

    it('should throw NotFoundException user not found', async () => {
      userRepository.getById.mockResolvedValue(null);

      try {
        await userService.getOtherProfile(1);
      } catch (e) {
        expect(e.message).toBe('User not found');
        expect(userPreferencesService.getById).toBeCalledTimes(0);
        expect(userRepository.getOtherProfile).toBeCalledTimes(0);
        expect(swipesService.create).toBeCalledTimes(0);
      }
    });

    it('should throw NotFoundException reach match limit', async () => {
      const user = { id: 1, isSubscribed: false };
      userRepository.getById.mockResolvedValue(user as UserEntity);
      swipesService.getCountSwipesByUserIdByDate.mockResolvedValue(10);

      try {
        await userService.getOtherProfile(1);
      } catch (e) {
        expect(e.message).toBe('You have reached the limit of swipes');
        expect(userPreferencesService.getById).toBeCalledTimes(0);
        expect(userRepository.getOtherProfile).toBeCalledTimes(0);
        expect(swipesService.create).toBeCalledTimes(0);
      }
    });

    it('should throw NotFoundException profile not found', async () => {
      const user = { id: 1, isSubscribed: false };
      userRepository.getById.mockResolvedValue(user as UserEntity);
      userPreferencesService.getById.mockResolvedValue(null);
      userRepository.getOtherProfile.mockResolvedValue(null);

      try {
        await userService.getOtherProfile(1);
      } catch (e) {
        expect(e.message).toBe('Profile not found');
        expect(userPreferencesService.getById).toBeCalledTimes(1);
        expect(userRepository.getOtherProfile).toBeCalledTimes(1);
        expect(swipesService.create).toBeCalledTimes(0);
      }
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { id: 1 };
      userRepository.getById.mockResolvedValue(user as UserEntity);

      await userService.update(1, {});

      expect(userRepository.update).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      userRepository.getById.mockResolvedValue(null);

      try {
        await userService.update(1, {});
      } catch (e) {
        expect(e.message).toBe('User not found');
      }
    });
  });
});
