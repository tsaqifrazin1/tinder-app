import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'decorators/auth-user.decorator';
import { UserEntity } from 'modules/user/entitites';
import { BaseController } from 'src/common/base/base.controller';
import { ApiNotFound } from 'src/common/decorators/error';
import {
  UseObjectInterceptors
} from 'src/common/decorators/request';
import { IResponse } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { UpdateSwipesDto } from '../dto';
import { ISwipesService, SwipesServiceToken } from '../interface';

@Controller('users')
@ApiTags('Swipes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SwipesController extends BaseController {
  constructor(
    @Inject(SwipesServiceToken)
    private readonly _swipesService: ISwipesService,
  ) {
    super();
  }

  @Patch('swipes')
  @UseObjectInterceptors({
    description: 'Update Swipes by Id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update Swipes by Id',
  })
  @ApiNotFound({
    message: 'Swipes not found',
    description: 'Swipes not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async updateCompaniesById(
    @Body() dto: UpdateSwipesDto,
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<void>> {
    dto.swiperId = user.id;
    await this._swipesService.update(dto);
    return {
      message: 'success update swipes',
    };
  }
}
