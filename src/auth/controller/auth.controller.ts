import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { RefreshJwtAuthGuard } from '../guards/jwt-auth/refresh-jwt-auth.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(ClassSerializerInterceptor)
  async signupUser(@Body() userSignupDto: UserSignupDto) {
    return this.authService.createUser(userSignupDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(HttpStatus.OK)
  loginUser(@Request() req: RequestWithUser) {
    return this.authService.loginUser(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  refreshAccessToken(@Req() req: RequestWithUser) {
    return this.authService.refreshToken(req.user);
  }
}
