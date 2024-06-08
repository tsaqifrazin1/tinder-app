import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsString } from 'class-validator';

export class CreateUserDto extends OmitType(UserDto, [
  'isSubscribed',
] as const) {
  @ApiProperty()
  @IsString()
  password: string;
}
