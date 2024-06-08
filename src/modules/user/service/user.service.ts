import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IUserRepository,
  IUserService,
  UserRepositoryToken,
} from '../interface';
import { CreateUserDto } from '../dto';
import { UserEntity } from '../entitites';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: IUserRepository,
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

  async update(id: number, dto: any): Promise<void> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.update(id, dto);
  }
}
