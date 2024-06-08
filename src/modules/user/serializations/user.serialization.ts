import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { GenderEnum } from 'common/enum/genderEnum';

@Exclude()
export class UserGetSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  firstname: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  gender: GenderEnum;

  @ApiProperty()
  @Expose()
  bod: Date;

  @ApiProperty()
  @Expose()
  bio: string;

  @ApiProperty()
  @Expose()
  isSubscribed: boolean;
}
