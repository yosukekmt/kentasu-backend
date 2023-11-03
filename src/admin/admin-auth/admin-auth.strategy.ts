import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(
  Strategy,
  'admin-auth-guard',
) {
  constructor(private readonly service: AdminAuthService) {
    super();
  }

  async validate(bearerToken: string): Promise<any> {
    try {
      const user = await this.service.validateUser(bearerToken);
      return user;
    } catch (err) {
      Logger.warn(err);
      throw new UnauthorizedException();
    }
  }
}
