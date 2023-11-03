import { Module } from '@nestjs/common';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminsModule } from './admins/admins.module';
import { FirebaseModule } from './firebase/firebase.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AdminAuthModule, FirebaseModule, AdminsModule, UsersModule],
})
export class AdminModule {}
