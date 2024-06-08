import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { SwipeActionEnum } from 'common/enum';
import { UserEntity } from 'modules/user/entitites';

export class SwipesDto {
  swiped: UserEntity;
  swiper: UserEntity;

  swiperId?: number;

  @ApiProperty({
    enum: SwipeActionEnum,
  })
  @IsEnum(SwipeActionEnum)
  action: SwipeActionEnum;
}
