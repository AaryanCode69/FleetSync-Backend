import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/service/user.service';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('user')
export class UserControllerController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Request() req: RequestWithUser) {
    return this.userService.findById(req.user.id);
  }
}
