import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { PreferredGenderEnum } from 'common/enum';
import { UserEntity } from 'modules/user/entitites';

export class UserPreferencesDto {
  id: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  ageMin: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  ageMax: number;

  @ApiProperty({
    enum: PreferredGenderEnum,
  })
  @IsEnum(PreferredGenderEnum)
  preferredGender: PreferredGenderEnum;

  user: UserEntity;
}
