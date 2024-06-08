import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from '../dto';
import { UserPreferencesEntity } from '../entities';
import { IUserPreferencesRepository } from '../interface';

@Injectable()
export class UserPreferencesRepository implements IUserPreferencesRepository {
  constructor(
    @InjectRepository(UserPreferencesEntity)
    private readonly user_preferencesRepository: Repository<UserPreferencesEntity>,
  ) {}

  async create(dto: CreateUserPreferencesDto): Promise<UserPreferencesEntity> {
    const user_preferences = this.user_preferencesRepository.create({
      ...dto,
      id: dto.user.id,
    });
    return this.user_preferencesRepository.save(user_preferences);
  }

  async getById(id: number): Promise<UserPreferencesEntity> {
    const queryBuilder =
      this.user_preferencesRepository.createQueryBuilder('user_preferences');
    queryBuilder.where('user_preferences.id = :id', { id });

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateUserPreferencesDto): Promise<void> {
    await this.user_preferencesRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    await this.user_preferencesRepository.softDelete(id);
  }
}
