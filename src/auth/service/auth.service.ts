import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import { UserLoginDto } from '../dto/user-login-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { AuthJwtPayload } from '../types/authjwt.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async createUser(userSignUpDto: UserSignupDto) {
    return this.userService.signup(userSignUpDto);
  }

  async loginUser(
    userLoginDto: UserLoginDto
  ): Promise<LoginResponseDto | null> {
    const user = await this.userService.findByUsernameOrEmail(
      userLoginDto.identifier
    );

    if (user == null) {
      throw new UnauthorizedException('User Does Not Exist');
    }
    const { password } = user;
    const isMatch = await bcrypt.compare(userLoginDto.password, password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect User Credentials');
    }
    const payload: AuthJwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken: accessToken,
      user: new UserResponseDto(user),
    };
  }
}
