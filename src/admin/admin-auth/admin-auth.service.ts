import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async validateUser(firebaseTokenId: string): Promise<Admin> {
    const firebaseUser = await this.firebaseService.findOneByIdToken(
      firebaseTokenId,
    );
    let item = await this.prisma.admin.findUnique({
      where: { firebaseUserId: firebaseUser.uid },
    });
    item = await this.prisma.admin.update({
      where: { id: item.id },
      data: {
        email: firebaseUser.email,
        firebaseUserId: firebaseUser.uid,
        firebaseUserRaw: firebaseUser.toJSON(),
      },
    });
    return item;
  }
}
