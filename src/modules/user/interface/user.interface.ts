import { CreateUserDto, FilterOtherProfileDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entitites';

/**
 * @description User Repository Token
 */
export const UserRepositoryToken = Symbol('UserRepositoryToken');

/**
 * @description User Repository Interface
 */
export interface IUserRepository {
  /**
   *@description Create User to Database
   */
  create(dto: CreateUserDto): Promise<UserEntity>;

  /**
   * @description Get User by Id from Database
   */
  getById(id: number): Promise<UserEntity>;

  /**
   * @description Get User by Username from Database
   */
  getByUsername(username: string): Promise<UserEntity>;

  /**
   * @description Get Other Profile from Database
   */
  getOtherProfile(
    id: number,
    filter?: FilterOtherProfileDto,
  ): Promise<UserEntity>;

  /**
   * @description Update User in Database
   */
  update(id: number, dto: UpdateUserDto): Promise<void>;
}

/**
 * @description User Service Token
 */
export const UserServiceToken = Symbol('UserServiceToken');

/**
 * @description User Service Interface
 */
export interface IUserService {
  /**
   * @description Create User
   */
  create(dto: CreateUserDto): Promise<UserEntity>;

  /**
   * @description Get User by Id
   */
  getById(id: number): Promise<UserEntity>;

  /**
   * @description Get User by Username
   */
  getByUsername(username: string): Promise<UserEntity>;

  /**
   * @description Get Other Profile
   */
  getOtherProfile(id: number): Promise<UserEntity>;

  /**
   * @description Update User
   */
  update(id: number, dto: UpdateUserDto): Promise<void>;
}
