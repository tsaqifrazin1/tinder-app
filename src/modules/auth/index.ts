import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user';
import { AuthController } from './controller';
import { JwtAuthGuard } from './guard';
import { AuthService } from './service';
import { JwtStrategy } from './strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
