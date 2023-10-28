import { Injectable } from '@nestjs/common';
import { Wallet, ethers } from 'ethers';

@Injectable()
export class BlockchainService {
  async createWallet(): Promise<Wallet> {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }
}
