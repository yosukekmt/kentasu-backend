import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOk(): string {
    return 'ok';
  }
  getLiveness(): boolean {
    return true;
  }
  getReadiness(): boolean {
    return true;
  }
}
