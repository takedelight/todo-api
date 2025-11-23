import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfig = (config: ConfigService): JwtModuleOptions => ({
  secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
  signOptions: {
    algorithm: 'HS256',
  },
});
