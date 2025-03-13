import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  healthcheck() {
    return 'OK';
  }

  @Get('start')
  start() {
    return this.appService.start();
  }

  @Post('request')
  request() {
    return this.appService.request();
  }

  @Post('response')
  response(@Body('vp_token') vp_token: Record<string, unknown>) {
    return this.appService.response(vp_token);
  }
}
