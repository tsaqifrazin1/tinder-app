import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'modules/user/entitites';
import { BaseController } from 'src/common/base/base.controller';
import { ApiNotFound } from 'src/common/decorators/error';
import { UseArrayInterceptors } from 'src/common/decorators/request';
import { AuthUser } from 'src/decorators';
import { IResponse } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { IMatchesService, MatchesServiceToken } from '../interface';
import { MatchesSerialization } from '../serialization/matches.serialization';

@Controller('users')
@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class MatchesController extends BaseController {
  constructor(
    @Inject(MatchesServiceToken)
    private readonly _matchesService: IMatchesService,
  ) {
    super();
  }

  @Get('matches')
  @UseArrayInterceptors(
    {
      description: 'Get Matches by Id',
      status: HttpStatus.OK,
    },
    MatchesSerialization,
  )
  @ApiOperation({
    summary: 'Get Matches by Id',
  })
  @ApiNotFound({
    message: 'Matches not found',
    description: 'Matches not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async getCompaniesById(
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<MatchesSerialization>> {
    const matches = await this._matchesService.getMatchesByUserId(user.id);
    if (!matches) {
      throw new NotFoundException('Matches not found');
    }
    return {
      message: 'success',
      data: this.transformArray(MatchesSerialization, matches),
    };
  }
}
