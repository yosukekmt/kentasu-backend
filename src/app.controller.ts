import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  root() {
    const resp = this.appService.getOk();
    return { status: resp };
  }

  @Get('/liveness_check')
  liveness() {
    const resp = this.appService.getLiveness();
    return { status: resp ? 'up' : 'down' };
  }

  @Get('/readiness_check')
  readiness() {
    const resp = this.appService.getReadiness();
    return { status: resp ? 'up' : 'down' };
  }
}
