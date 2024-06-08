import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PreferredGenderEnum } from 'common/enum';

@Exclude()
export class UserPreferencesSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  ageMin: number;

  @ApiProperty()
  @Expose()
  ageMax: number;

  @ApiProperty({
    enum: PreferredGenderEnum,
  })
  @Expose()
  preferredGender: PreferredGenderEnum;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}