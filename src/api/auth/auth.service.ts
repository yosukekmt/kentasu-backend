import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BlockchainService } from '../../blockchain/blockchain.service';
import { EncryptionService } from '../../encryption/encryption.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchain: BlockchainService,
    private readonly encryption: EncryptionService,
  ) {}

  async validateUser(payload: any): Promise<User> {
    console.log('payload');
    console.log(payload);

    let item = await this.prisma.user.findUnique({
      where: { auth0UserId: payload.sub },
    });
    if (!item) {
      console.log('payload');
      console.log(payload);

      const newWallet = await this.blockchain.createWallet();
      const { privateKey, ...wallet } = newWallet;
      console.log('wallet');
      console.log(wallet);

      const privateKeyEncrypted = this.encryption.encrypt(privateKey);
      item = await this.prisma.user.create({
        data: {
          email: payload.email,
          auth0UserId: payload.sub,
          //auth0UserRaw: payload,
          walletAddress: wallet.address,
          walletPrivateKeyEncrypted: privateKeyEncrypted,
          //walletRaw: wallet,
        },
      });
    }
    return item;
  }
}
