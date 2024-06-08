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
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/common/base/base.controller';
import { ApiNotFound, ApiUnauthorized } from 'src/common/decorators/error';
import {
  UseObjectInterceptors
} from 'src/common/decorators/request';
import { AuthUser, RolesTypeDecorators } from 'src/decorators';
import { RolesTypeGuard } from 'src/guards';
import { IResponse } from 'src/interceptors';
import { JwtAuthGuard } from 'src/modules/auth/guard';
import { Transactional } from 'typeorm-transactional';
import { UpdateUserDto } from '../dto';
import { UserEntity } from '../entitites';
import { IUserService, UserServiceToken } from '../interface';
import { UserGetSerialization } from '../serializations/user.serialization';

@Controller('user')
@ApiTags('User')
export class UserController extends BaseController {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: IUserService,
  ) {
    super();
  }

  @Get('me')
  @UseObjectInterceptors(
    {
      description: 'Get User by jwt token user id',
      status: 200,
    },
    UserGetSerialization,
  )
  @ApiOperation({
    summary: 'Get User by jwt token user id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getUsersById(
    @AuthUser() userLogin: UserEntity,
  ): Promise<IResponse<UserGetSerialization>> {
    const user = await this.userService.getById(userLogin.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'success',
      data: this.transformObject(UserGetSerialization, user),
    };
  }

  @Get('profiles')
  @UseObjectInterceptors(
    {
      description: 'Get User by jwt token user id',
      status: 200,
    },
    UserGetSerialization,
  )
  @ApiOperation({
    summary: 'Get User by jwt token user id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getOtherProfile(
    @AuthUser() userLogin: UserEntity,
  ): Promise<IResponse<UserGetSerialization>> {
    const user = await this.userService.getOtherProfile(userLogin.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'success',
      data: this.transformObject(UserGetSerialization, user),
    };
  }

  @Patch()
  @UseObjectInterceptors({
    description: 'Update User by jwt token user id',
    status: 200,
  })
  @ApiOperation({
    summary: 'Update User by jwt token user id',
  })
  @ApiNotFound({
    message: 'User not found',
    description: 'User not found',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Transactional()
  async updateUsersById(
    @Body() dto: UpdateUserDto,
    @AuthUser() userLogin: UserEntity,
  ): Promise<IResponse<void>> {
    await this.userService.update(userLogin.id, dto);
    return {
      message: 'success',
    };
  }
}
