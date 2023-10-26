import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from './auth.service';
import { BearerAuthGuard } from './bearer-auth.guard';
import { BearerStrategy } from './bearer.strategy';

@Global()
@Module({
  providers: [AuthService, PrismaService, BearerAuthGuard, BearerStrategy],
  exports: [AuthService, BearerAuthGuard, BearerStrategy],
})
export class AuthModule {}
