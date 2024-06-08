import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'modules/user/dto';
import { IUserService, UserServiceToken } from 'modules/user/interface';
import { UserEntity } from 'src/modules/user/entitites';
import { UtilService } from 'utils/service/utils.service';
import { LoginDto } from '../dto';
import { LoginSerialization } from '../serialization/login.serialization';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(UserServiceToken)
    private _userService: IUserService,
  ) {}
  async generateJwt(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: user.id,
      },
      { secret: this.configService.get('SECRET_KEY') },
    );
  }
  async decodeUser(jwttoken: string): Promise<LoginSerialization> {
    const token = await this.jwtService.verifyAsync(jwttoken, {
      secret: this.configService.get('SECRET_KEY'),
    });

    const user = await this._userService.getById(token.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async registerUser(dto: CreateUserDto): Promise<UserEntity> {
    dto.password = await UtilService.generateHash(dto.password);
    const user = await this._userService.create(dto);
    return user;
  }

  async login(dto: LoginDto): Promise<LoginSerialization> {
    const user = await this._userService.getByUsername(dto.username);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await UtilService.compareHash(
      dto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.generateJwt(user);
    const decode = await this.decodeUser(token);
    decode.token = token;

    return decode;
  }
}
