import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { AuthJwtPayload } from '../types/authjwt.type';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async createUser(userSignUpDto: UserSignupDto) {
    return this.userService.signup(userSignUpDto);
  }

  async validateUser(identifier: string, pass: string) {
    const user = await this.userService.findByUsernameOrEmail(identifier);

    if (user == null) {
      throw new UnauthorizedException('User Does Not Exist');
    }
    const { password, ...result } = user;
    const isMatch = await bcrypt.compare(pass, password);
    if (user && isMatch) {
      return result;
    }
    return null;
  }

  loginUser(user: User): LoginResponseDto {
    const payload: AuthJwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: new UserResponseDto(user),
    };
  }
}
