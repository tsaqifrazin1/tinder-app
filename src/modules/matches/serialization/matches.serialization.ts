import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserGetSerialization } from 'modules/user/serializations/user.serialization';

@Exclude()
export class MatchesSerialization {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({
    type: () => UserGetSerialization
  })
  @Type(() => UserGetSerialization)
  @Expose()
  userOne: UserGetSerialization;

  @ApiProperty({
    type: () => UserGetSerialization
  })
  @Type(() => UserGetSerialization)
  @Expose()
  userTwo: UserGetSerialization;

  @ApiProperty()
  @Expose()
  matchedAt: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}