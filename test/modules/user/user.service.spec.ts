import { TestBed } from '@automock/jest';
import { CreateUserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entitites';
import { IUserRepository, UserRepositoryToken } from 'modules/user/interface';
import { UserRepository } from 'modules/user/repository';
import { UserService } from 'modules/user/service';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(UserService).compile();
    userService = unit;
    userRepository = unitRef.get<UserRepository>(UserRepositoryToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
