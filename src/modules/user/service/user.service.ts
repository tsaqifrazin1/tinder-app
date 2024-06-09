import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GenderEnum, PreferredGenderEnum, SwipeActionEnum } from 'common/enum';
import { ISwipesService, SwipesServiceToken } from 'modules/swipes/interface';
import {
  IUserPreferencesService,
  UserPreferencesServiceToken,
} from 'modules/user_preferences/interface';
import { Transactional } from 'typeorm-transactional';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import {
  IUserRepository,
  IUserService,
  UserRepositoryToken,
} from '../interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
    @Inject(UserPreferencesServiceToken)
    private readonly userPreferencesService: IUserPreferencesService,
    @Inject(SwipesServiceToken)
    private readonly swipesService: ISwipesService,
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

  @Transactional()
  async getOtherProfile(id: number): Promise<UserEntity> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isSubscribed) {
      const countSwipes = await this.swipesService.getCountSwipesByUserIdByDate(
        id,
        new Date(),
      );

      if (countSwipes >= 10) {
        throw new NotFoundException('You have reached the limit of swipes');
      }
    }

    const defaultPreferredGender =
      user.gender === GenderEnum.M
        ? PreferredGenderEnum.F
        : PreferredGenderEnum.M;

    const userPreferences = await this.userPreferencesService.getById(id);
    const profile = await this.userRepository.getOtherProfile(id, {
      ageMin: userPreferences?.ageMin,
      ageMax: userPreferences?.ageMax,
      preferredGender:
        userPreferences?.preferredGender ?? defaultPreferredGender,
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.swipesService.create({
      swiper: user,
      swiped: profile,
      action: SwipeActionEnum.LEFT,
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
