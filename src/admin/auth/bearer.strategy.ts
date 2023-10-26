import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(bearerToken: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(bearerToken);
      return user;
    } catch (err) {
      Logger.warn(err);
      throw new UnauthorizedException();
    }
  }
}
