import { TestBed } from '@automock/jest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'modules/auth/service';
import { UserEntity } from 'modules/user/entitites';
import { IUserService, UserServiceToken } from 'modules/user/interface';
import { UserService } from 'modules/user/service';
import { UtilService } from '../../../src/utils/service/utils.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: jest.Mocked<JwtService>;
  let userService: jest.Mocked<IUserService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();
    authService = unit;
    jwtService = unitRef.get(JwtService);
    userService = unitRef.get<UserService>(UserServiceToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('generateJwt', () => {
    it('should return a jwt token', async () => {
      const user = { id: 1 };
      const token = 'token';

      jwtService.signAsync.mockResolvedValue(token);

      const result = await authService.generateJwt(user as UserEntity);

      expect(result).toBe(token);
    });
  });

  describe('decodeUser', () => {
    it('should return a user', async () => {
      const user = { id: 1 };
      const token = 'token';

      jwtService.verifyAsync.mockReturnValue(user as any);
      userService.getById.mockResolvedValue(user as UserEntity);

      const result = await authService.decodeUser(token);

      expect(result).toBe(user);
      expect(jwtService.verifyAsync).toBeCalledTimes(1);
      expect(userService.getById).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      const user = { id: 1 };
      const token = 'token';

      jwtService.verifyAsync.mockReturnValue(user as any);
      userService.getById.mockResolvedValue(null);

      await expect(authService.decodeUser(token)).rejects.toThrowError(
        'User not found',
      );
    });
  });

  describe('registerUser', () => {
    it('should return a user', async () => {
      const user = { id: 1 };
      const dto = { password: 'password', username: 'username' };

      userService.create.mockResolvedValue(user as UserEntity);

      const result = await authService.registerUser(dto as any);

      expect(result).toBe(user);
      expect(userService.create).toBeCalledTimes(1);
    });
  });

  describe('login', () => {
    it('should return a user', async () => {
      const user = { id: 1, password: 'password' };
      const dto = { password: 'password', username: 'username' };
      const token = 'token';

      userService.getByUsername.mockResolvedValue(user as UserEntity);
      jwtService.signAsync.mockResolvedValue(token);
      jwtService.verify.mockReturnValue(user);
      userService.getById.mockResolvedValue(user as UserEntity);
      jest.spyOn(UtilService, 'compareHash').mockResolvedValue(true);

      const result = await authService.login(dto as any);

      expect(result).toBe(user);
      expect(userService.getByUsername).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledTimes(1);
      expect(jwtService.verifyAsync).toBeCalledTimes(1);
      expect(userService.getById).toBeCalledTimes(1);
    });

    it('should throw BadRequestException if user does not exist', async () => {
      const dto = { password: 'password', username: 'username' };

      userService.getByUsername.mockResolvedValue(null);

      await expect(authService.login(dto as any)).rejects.toThrowError(
        'Invalid credentials',
      );
    });

    it('should throw BadRequestException if password does not match', async () => {
      const user = { id: 1, password: 'password' };
      const dto = { password: 'password', username: 'username' };

      userService.getByUsername.mockResolvedValue(user as UserEntity);
      jest.spyOn(UtilService, 'compareHash').mockResolvedValue(false);

      await expect(authService.login(dto as any)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });
});
