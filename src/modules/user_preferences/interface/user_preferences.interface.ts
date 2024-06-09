import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from '../dto';
import { UserPreferencesEntity } from '../entities';

/**
 * @description UserPreferencesRepository Token
 */
export const UserPreferencesRepositoryToken = Symbol(
  'UserPreferencesRepositoryToken',
);

/**
 * @description UserPreferencesRepository Interface
 */
export interface IUserPreferencesRepository {
  /**
   * @description Create UserPreferences to Database
   */
  create(dto: CreateUserPreferencesDto): Promise<UserPreferencesEntity>;

  /**
   * @description Get UserPreferences by Id from Database
   */
  getById(id: number): Promise<UserPreferencesEntity>;

  /**
   * @description Update UserPreferences in Database
   */
  update(id: number, dto: UpdateUserPreferencesDto): Promise<void>;

  /**
   * @description Soft Delete UserPreferences from Database
   */
  delete(id: number): Promise<void>;
}

/**
 * @description UserPreferences Service Token
 */
export const UserPreferencesServiceToken = Symbol(
  'UserPreferencesServiceToken',
);

/**
 * @description UserPreferences Service Interface
 */
export interface IUserPreferencesService {
  /**
   * @description Create UserPreferences
   */
  create(dto: CreateUserPreferencesDto): Promise<UserPreferencesEntity>;

  /**
   * @description Get UserPreferences by Id
   */
  getById(id: number): Promise<UserPreferencesEntity>;

  /**
   * @description Update UserPreferences
   */
  update(id: number, dto: UpdateUserPreferencesDto): Promise<void>;

  /**
   * @description Soft Delete UserPreferences
   */
  delete(id: number): Promise<void>;
}
