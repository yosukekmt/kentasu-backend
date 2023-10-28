import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
