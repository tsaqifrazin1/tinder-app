import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GenderEnum, PreferredGenderEnum } from 'common/enum';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import {
  IUserRepository,
  IUserService,
  UserRepositoryToken,
} from '../interface';
import {
  UserPreferencesRepositoryToken,
  IUserPreferencesRepository,
} from 'modules/user_preferences/interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(UserPreferencesRepositoryToken)
    private readonly userPreferencesRepository: IUserPreferencesRepository,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }

  async getById(id: number): Promise<UserEntity> {
    return this.userRepository.getById(id);
  }

  async getByUsername(username: string): Promise<UserEntity> {
    return this.userRepository.getByUsername(username);
  }

  async getOtherProfile(id: number): Promise<UserEntity> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const defaultPreferredGender =
      user.gender === GenderEnum.M
        ? PreferredGenderEnum.F
        : PreferredGenderEnum.M;

    const userPreferences = await this.userPreferencesRepository.getById(id);
    const profile = await this.userRepository.getOtherProfile(id, {
      ageMin: userPreferences?.ageMin,
      ageMax: userPreferences?.ageMax,
      preferredGender:
        userPreferences?.preferredGender ?? defaultPreferredGender,
    });
    return profile;
  }

  async update(id: number, dto: any): Promise<void> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.update(id, dto);
  }
}
