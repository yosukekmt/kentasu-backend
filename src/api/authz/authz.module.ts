import { Global, Module } from '@nestjs/common';
import { AuthzStrategy } from './authz.strategy';

@Global()
@Module({
  providers: [AuthzStrategy],
  exports: [AuthzStrategy],
})
export class AuthzModule {}
