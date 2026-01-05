import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './service/user.service';
import { UserControllerController } from './controller/user.controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule, UserService],
  providers: [UserService],
  controllers: [UserControllerController],
})
export class UserModule {}
