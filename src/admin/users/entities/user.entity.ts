import { Prisma, User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements User {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  walletAddress: string;

  @Exclude()
  walletPrivateKeyEncrypted: string;

  @Exclude()
  walletRaw: Prisma.JsonValue;

  @Exclude()
  auth0UserId: string;

  @Exclude()
  auth0UserRaw: Prisma.JsonValue;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
