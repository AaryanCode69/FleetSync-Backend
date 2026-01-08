import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { RefreshJwtAuthGuard } from '../guards/jwt-auth/refresh-jwt-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';

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

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutUser(@Request() req: RequestWithUser) {
    await this.authService.logoutUser(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  refreshAccessToken(
    @Req() req: RequestWithUser,
    @Headers('authorization') authHeader: string
  ) {
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const refreshToken = authHeader.slice(7);
    return this.authService.refreshToken(req.user, refreshToken);
  }
}
