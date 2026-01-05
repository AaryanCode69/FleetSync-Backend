import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.JWT_SECRET_KEY,
    signOptions: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expiresIn: (process.env.JWT_EXPIRY_IN || '15m') as any,
    },
  })
);
