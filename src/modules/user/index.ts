import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entitites';
import { UserController } from './controller';
import { UserService } from './service';
import { UserRepository } from './repository';
import { UserRepositoryToken, UserServiceToken } from './interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    {
      provide: UserRepositoryToken,
      useClass: UserRepository,
    },
    {
      provide: UserServiceToken,
      useClass: UserService,
    },
  ],
  exports: [UserService, UserRepository, UserRepositoryToken, UserServiceToken],
})
export class UserModule {}
