import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, FilterOtherProfileDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import { IUserRepository } from '../interface';
import { PreferredGenderEnum, SwipeActionEnum } from 'common/enum';

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

  async getOtherProfile(
    id: number,
    filter?: FilterOtherProfileDto,
  ): Promise<UserEntity> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');
    queryBuilder.where('users.id != :id', { id });
    if (filter?.ageMin) {
      queryBuilder.andWhere(
        'EXTRACT(YEAR FROM AGE(CURRENT_DATE, users.dob)) >= :ageMin',
        { ageMin: filter.ageMin },
      );
    }
    if (filter?.ageMax) {
      queryBuilder.andWhere(
        'EXTRACT(YEAR FROM AGE(CURRENT_DATE, users.dob)) <= :ageMax',
        { ageMax: filter.ageMax },
      );
    }
    if (
      filter?.preferredGender &&
      filter?.preferredGender !== PreferredGenderEnum.BOTH
    ) {
      queryBuilder.andWhere('users.gender = :preferredGender', {
        preferredGender: filter.preferredGender,
      });
    }

    queryBuilder.andWhere(
      `"users"."id" not in (SELECT swipes.swiped_id 
                          FROM swipes 
                        WHERE 
                          (swipes.swiper_id = :id and swipes."swiped_at" = :date) or
                          (swipes.swiper_id = :id and swipes.action = :action) or
                          (swipes.swiped_id = :id and swipes.action = :action)
                        )`,
      { id, action: SwipeActionEnum.LEFT, date: new Date().toISOString().split('T')[0]},
    );

    queryBuilder.andWhere(
      `"users"."id" not in (SELECT swipes.swiper_id
                           FROM swipes
                           WHERE (swipes.swiped_id = :id and swipes.swiper_id = "users"."id" and swipes.action = :action)
                           )`,
      { id, action: SwipeActionEnum.LEFT },
    );

    queryBuilder.orderBy('RANDOM()');

    return queryBuilder.getOne();
  }

  async update(id: number, dto: UpdateUserDto): Promise<void> {
    await this.userRepository.update(id, dto);
  }
}
