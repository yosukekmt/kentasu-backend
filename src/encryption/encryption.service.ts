import { Injectable } from '@nestjs/common';
import * as Crypto from 'crypto';

@Injectable()
export class EncryptionService {
  public readonly encryptionKeyBuf: Buffer;

  constructor() {
    this.encryptionKeyBuf = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }

  encrypt(arg: string): string {
    const argBuf = Buffer.from(arg);
    const ivBuf = Crypto.randomBytes(16);
    const cipher = Crypto.createCipheriv(
      'aes-256-ctr',
      this.encryptionKeyBuf,
      ivBuf,
    );
    const encryptedBuf = Buffer.concat([cipher.update(argBuf), cipher.final()]);
    return ivBuf.toString('hex') + encryptedBuf.toString('hex');
  }

  decrypt(arg: string): string {
    const ivBuf = Buffer.from(arg.substring(0, 32), 'hex');
    const encryptedBuf = Buffer.from(arg.substring(32, arg.length), 'hex');
    const decipher = Crypto.createDecipheriv(
      'aes-256-ctr',
      this.encryptionKeyBuf,
      ivBuf,
    );
    const decryptedBuf = decipher.update(encryptedBuf);
    const decrypted = Buffer.concat([decryptedBuf, decipher.final()]);
    return decrypted.toString();
  }
}
