import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'common/base/base.controller';
import { ApiBadRequest, ApiNotFound } from 'src/common/decorators/error';
import { UseObjectInterceptors } from 'src/common/decorators/request';
import { IdSerialization } from 'src/common/serialization';
import { IResponse } from 'src/interceptors';
import { CreateUserDto } from 'src/modules/user/dto';
import { LoginDto } from '../dto';
import { LoginSerialization } from '../serialization/login.serialization';
import { AuthService } from '../service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController {
  constructor(private readonly _authService: AuthService) {
    super();
  }

  @Post('register')
  @UseObjectInterceptors(
    {
      description: 'Create User',
      status: HttpStatus.CREATED,
    },
    IdSerialization,
  )
  @ApiOperation({
    summary: 'Create User',
  })
  async createUser(
    @Body() dto: CreateUserDto,
  ): Promise<IResponse<IdSerialization>> {
    const registeredUser = await this._authService.registerUser(dto);
    return {
      message: 'success create user',
      data: {
        id: registeredUser.id,
      },
    };
  }

  @Post('login')
  @UseObjectInterceptors(
    {
      description: 'Login User',
      status: HttpStatus.CREATED,
    },
    LoginSerialization,
  )
  @ApiOperation({
    summary: 'Login User',
  })
  @ApiNotFound({
    description: 'Invalid credentials',
    message: 'Invalid credentials',
    statusCode: HttpStatus.NOT_FOUND,
  })
  @ApiBadRequest({
    description: 'Invalid credentials',
    message: 'Invalid credentials',
    statusCode: HttpStatus.BAD_REQUEST,
  })
  async login(@Body() dto: LoginDto): Promise<IResponse<any>> {
    const authenticatedUserInfo = await this._authService.login(dto);
    return {
      message: 'success login',
      data: this.transformObject(LoginSerialization, authenticatedUserInfo),
    };
  }
}
