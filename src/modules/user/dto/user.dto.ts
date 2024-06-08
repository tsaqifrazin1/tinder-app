import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from 'common/enum';

export class UserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty({
    enum: GenderEnum,
  })
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty()
  @IsDateString()
  dob: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if(value === 'true') return true;
    if(value === 'false') return false;
    return value;
  })
  isSubscribed: boolean = false;

  password: string;
}
