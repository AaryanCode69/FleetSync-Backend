import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import { UserLoginDto } from '../dto/user-login-request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async createUser(userSignUpDto: UserSignupDto) {
    return this.userService.signup(userSignUpDto);
  }

  async loginUser(userLoginDto: UserLoginDto) {
    const user = await this.userService.findByUsernameOrEmail(
      userLoginDto.identifier
    );
    if (user == null) {
      throw new UnauthorizedException('User Does Not Exist');
    }
    const isMatch = await bcrypt.compare(userLoginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect User Credentials');
    }
    return user;
  }
}
