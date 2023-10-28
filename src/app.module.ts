import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlockchainModule } from './blockchain/blockchain.module';
import { EncryptionModule } from './encryption/encryption.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, BlockchainModule, EncryptionModule, ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
