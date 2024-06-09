import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'decorators/auth-user.decorator';
import { UserEntity } from 'modules/user/entitites';
import { BaseController } from 'src/common/base/base.controller';
import { ApiNotFound } from 'src/common/decorators/error';
import { UseObjectInterceptors } from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { IResponse } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { CreateUserPreferencesDto, UpdateUserPreferencesDto } from '../dto';
import {
  IUserPreferencesService,
  UserPreferencesServiceToken,
} from '../interface';
import { UserPreferencesSerialization } from '../serialization/user_preferences.serialization';

@Controller('users')
@ApiTags('UserPreferences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserPreferencesController extends BaseController {
  constructor(
    @Inject(UserPreferencesServiceToken)
    private readonly _user_preferencesService: IUserPreferencesService,
  ) {
    super();
  }

  @Post('preferences')
  @UseObjectInterceptors(
    {
      description: 'Create UserPreferences by jwt token user id',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create UserPreferences',
  })
  async createUserPreferences(
    @Body() dto: CreateUserPreferencesDto,
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<IdSerialization>> {
    dto.user = user;
    const user_preferences = await this._user_preferencesService.create(dto);
    return {
      message: 'success create user_preferences',
      data: {
        id: user_preferences.id,
      },
    };
  }

  @Get('preferences')
  @UseObjectInterceptors(
    {
      description: 'Get UserPreferences by jwt token user id',
      status: HttpStatus.OK,
    },
    UserPreferencesSerialization,
  )
  @ApiOperation({
    summary: 'Get UserPreferences by jwt token user id',
  })
  @ApiNotFound({
    message: 'UserPreferences not found',
    description: 'UserPreferences not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async getCompaniesById(
    @AuthUser() user: UserEntity,
  ): Promise<IResponse<UserPreferencesSerialization>> {
    const user_preferences = await this._user_preferencesService.getById(
      user.id,
    );
    if (!user_preferences) {
      throw new NotFoundException('UserPreferences not found');
    }
    return {
      message: 'success',
      data: this.transformObject(
        UserPreferencesSerialization,
        user_preferences,
      ),
    };
  }

  @Patch('preferences')
  @UseObjectInterceptors({
    description: 'Update UserPreferences by jwt token user id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Update UserPreferences by jwt token user id',
  })
  @ApiNotFound({
    message: 'UserPreferences not found',
    description: 'UserPreferences not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async updateCompaniesById(
    @Param('id') id: number,
    @Body() dto: UpdateUserPreferencesDto,
  ): Promise<IResponse<void>> {
    await this._user_preferencesService.update(id, dto);
    return {
      message: 'success update user_preferences',
    };
  }

  @Delete('preferences')
  @UseObjectInterceptors({
    description: 'Delete UserPreferences by jwt token user id',
    status: HttpStatus.OK,
  })
  @ApiOperation({
    summary: 'Delete UserPreferences by jwt token user id',
  })
  @ApiNotFound({
    message: 'UserPreferences not found',
    description: 'UserPreferences not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  async deleteCompaniesById(@Param('id') id: number): Promise<IResponse<void>> {
    await this._user_preferencesService.delete(id);
    return {
      message: 'success delete user_preferences',
    };
  }
}
