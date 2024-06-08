import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import { IUserRepository } from '../interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const entity = this.userRepository.create(dto);
    return this.userRepository.save(entity);
  }

  async getById(id: number): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.id = :id', { id });

    return queryBuilder.getOne();
  }

  async getByUsername(username: string): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.username = :username', { username });

    return queryBuilder.getOne();
  }
  
  async update(id: number, dto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, dto);
  }
}
