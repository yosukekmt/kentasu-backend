import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH0_PUBLIC_KEY,
    });
  }

  async validate(payload: any) {
    console.log('validate called');
    try {
      const user = await this.authService.validateUser(payload);
      return user;
    } catch (err) {
      Logger.warn(err);
      throw new UnauthorizedException();
    }
  }
}
