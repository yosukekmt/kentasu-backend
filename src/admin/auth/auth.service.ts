import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async validateUser(firebaseTokenId: string): Promise<Admin> {
    const firebaseUser = await this.firebaseService.findOneByIdToken(
      firebaseTokenId,
    );
    console.log('firebaseUser');
    console.log(firebaseUser);
    let item = await this.prisma.admin.findUnique({
      where: { firebaseUserId: firebaseUser.uid },
    });
    console.log('item1');
    console.log(item);

    console.log(firebaseUser.email);
    console.log(firebaseUser.uid);
    console.log(firebaseUser.toJSON());

    item = await this.prisma.admin.update({
      where: { id: item.id },
      data: {
        email: firebaseUser.email,
        firebaseUserId: firebaseUser.uid,
        firebaseUserRaw: firebaseUser.toJSON(),
      },
    });
    console.log('item2');
    console.log(item);
    return item;
  }
}
