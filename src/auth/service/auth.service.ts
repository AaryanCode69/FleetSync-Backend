import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { UserSignupDto } from '../dto/user-signup-request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from '../dto/login-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { AuthJwtPayload } from '../types/authjwt.type';
import { User } from 'src/user/entities/user.entity';
import refreshJwtConfig from '../config/refresh-jwt.config';
import type { ConfigType } from '@nestjs/config';
import { RefreshTokenEntity } from '../entity/refresh-token.entity';
import { DataSource, IsNull } from 'typeorm';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    private dataSoure: DataSource
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

  async loginUser(user: User): Promise<LoginResponseDto> {
    const payload: AuthJwtPayload = {
      sub: user.id,
      username: user.username,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    const expiresIn =
      typeof this.refreshTokenConfig.expiresIn === 'string'
        ? this.refreshTokenConfig.expiresIn
        : '7d';
    await this.dataSoure.transaction(async (manager) => {
      await manager.update(
        RefreshTokenEntity,
        { user: user, revokedAt: IsNull() },
        { revokedAt: new Date() }
      );

      const refreshEntity = manager.create(RefreshTokenEntity, {
        tokenHash: hashedRefreshToken,
        user: user,
        expiresAt: new Date(Date.now() + ms(expiresIn)),
      });

      await manager.save(refreshEntity);
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: new UserResponseDto(user),
    };
  }

  async refreshToken(user: User, refreshToken: string) {
    return this.dataSoure.transaction(async (manager) => {
      const existingToken = await manager.findOneBy(RefreshTokenEntity, {
        user: user,
        revokedAt: IsNull(),
      });

      if (!existingToken) {
        throw new UnauthorizedException('Refresh Token Not Found');
      }

      const isValid = await bcrypt.compare(
        refreshToken,
        existingToken.tokenHash
      );

      if (!isValid) {
        await manager.update(
          RefreshTokenEntity,
          { user },
          { revokedAt: new Date() }
        );
        throw new UnauthorizedException('Invalid Refresh Token');
      }

      if (existingToken.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh Token Expired');
      }

      await manager.update(
        RefreshTokenEntity,
        { id: existingToken.id },
        { revokedAt: new Date() }
      );

      const payload: AuthJwtPayload = {
        sub: user.id,
        username: user.username,
      };

      const newRefreshToken = this.jwtService.sign(
        payload,
        this.refreshTokenConfig
      );

      const salt = await bcrypt.genSalt();
      const newHashedToken = await bcrypt.hash(newRefreshToken, salt);

      const expiresIn =
        typeof this.refreshTokenConfig.expiresIn === 'string'
          ? this.refreshTokenConfig.expiresIn
          : '7d';

      const newRefreshEntity = manager.create(RefreshTokenEntity, {
        tokenHash: newHashedToken,
        user,
        expiresAt: new Date(Date.now() + ms(expiresIn)),
      });

      await manager.save(newRefreshEntity);

      return newRefreshToken;
    });
  }
}
