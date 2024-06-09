import { PartialType } from '@nestjs/swagger';
import { SwipesDto } from './swipes.dto';

export class UpdateSwipesDto extends PartialType(SwipesDto) {}
