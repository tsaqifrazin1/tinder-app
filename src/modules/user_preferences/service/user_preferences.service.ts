import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from '../dto';
import { UserPreferencesEntity } from '../entities';
import {
  IUserPreferencesRepository,
  IUserPreferencesService,
  UserPreferencesRepositoryToken,
} from '../interface';

@Injectable()
export class UserPreferencesService implements IUserPreferencesService {
  constructor(
    @Inject(UserPreferencesRepositoryToken)
    private readonly user_preferencesRepository: IUserPreferencesRepository,
  ) {}

  async create(dto: CreateUserPreferencesDto): Promise<UserPreferencesEntity> {
    return this.user_preferencesRepository.create(dto);
  }

  async getById(id: number): Promise<UserPreferencesEntity> {
    return this.user_preferencesRepository.getById(id);
  }

  async update(id: number, dto: UpdateUserPreferencesDto): Promise<void> {
    const user_preferences = await this.user_preferencesRepository.getById(id);
    if (!user_preferences) {
      throw new NotFoundException('UserPreferences not found');
    }
    return this.user_preferencesRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const user_preferences = await this.user_preferencesRepository.getById(id);
    if (!user_preferences) {
      throw new NotFoundException('UserPreferences not found');
    }
    return this.user_preferencesRepository.delete(id);
  }
}
