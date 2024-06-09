import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from 'modules/user/entitites';

export class MatchesDto {
  userOne?: UserEntity
  userTwo?: UserEntity

  userOneId?: number
  userTwoId?: number
}