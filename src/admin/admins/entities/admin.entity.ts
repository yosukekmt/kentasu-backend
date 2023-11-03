import { Admin } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class AdminEntity implements Admin {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  firebaseUserId: string;

  @Exclude()
  firebaseUserRaw: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}
