import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'password',
  })
  @IsString()
  password: string;
}
