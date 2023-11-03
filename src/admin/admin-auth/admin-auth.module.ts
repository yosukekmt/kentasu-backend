import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminAuthGuard } from './admin-auth.guard';
import { AdminAuthService } from './admin-auth.service';
import { AdminAuthStrategy } from './admin-auth.strategy';

@Global()
@Module({
  providers: [
    AdminAuthService,
    PrismaService,
    AdminAuthGuard,
    AdminAuthStrategy,
  ],
  exports: [AdminAuthService, AdminAuthGuard, AdminAuthStrategy],
})
export class AdminAuthModule {}
