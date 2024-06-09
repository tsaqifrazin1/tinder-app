import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class SwipesSerialization {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
