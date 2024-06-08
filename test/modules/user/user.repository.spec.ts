import { GenderEnum } from 'common/enum/genderEnum';
import { CreateUserDto, UpdateUserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/entitites';
import { UserRepository } from 'modules/user/repository';
import { DataSource } from 'typeorm';
import { setupConnection } from 'utils/setupConnection';

describe('UserRepository', () => {
  let _userRepository: UserRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await setupConnection();
    await dataSource.synchronize();
    _userRepository = new UserRepository(dataSource.getRepository(UserEntity));
  });

  afterAll(async () => {
    dataSource.destroy();
  });

  it('should be defined', () => {
    expect(_userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = {
        username: 'username',
        password: 'password',
        lastname: 'lastname',
        firstname: 'firstname',
        bio: 'bio',
        email: 'email',
        gender: GenderEnum.M,
        bod: new Date(),
      } as CreateUserDto;

      const result = await _userRepository.create(dto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should failed create a user with duplicate username', async () => {
      const dto = {
        username: 'username',
        password: 'password',
        lastname: 'lastname',
        firstname: 'firstname',
        bio: 'bio',
        email: 'email',
        gender: GenderEnum.M,
        bod: new Date(),
      } as CreateUserDto;

      await expect(_userRepository.create(dto)).rejects.toThrowError();
    });

    it('should failed create a user with duplicate email', async () => {
      const dto = {
        username: 'username',
        password: 'password',
        lastname: 'lastname',
        firstname: 'firstname',
        bio: 'bio',
        email: 'email',
        gender: GenderEnum.M,
        bod: new Date(),
      } as CreateUserDto;

      await expect(_userRepository.create(dto)).rejects.toThrowError();
    });
  });

  describe('getById', () => {
    it('should return a user', async () => {
      const result = await _userRepository.getById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should return null', async () => {
      const result = await _userRepository.getById(2);

      expect(result).toBeNull();
    });
  });

  describe('getByUsername', () => {
    it('should return a user', async () => {
      const result = await _userRepository.getByUsername('username');

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    it('should return null', async () => {
      const result = await _userRepository.getByUsername('username2');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto = {
        lastname: 'lastname',
        firstname: 'firstname',
        bio: 'bio',
        email: 'email',
      } as UpdateUserDto;

      await _userRepository.update(1, dto);
    });
  });
});
