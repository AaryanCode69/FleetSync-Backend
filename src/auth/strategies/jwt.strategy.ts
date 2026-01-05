import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { Inject, Injectable } from '@nestjs/common';
import { AuthJwtPayload } from '../types/authjwt.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret as string,
    });
  }

  validate(payload: AuthJwtPayload) {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
