import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  healthcheck() {
    return 'OK';
  }

  @Get('start')
  start(@Query('type') type: string) {
    return this.appService.start(type);
  }

  @Post('request/:type')
  request(@Param('type') type: string) {
    return this.appService.request(type);
  }

  @Post('response')
  response(@Body('vp_token') vp_token: Record<string, unknown>) {
    return this.appService.response(vp_token);
  }
}
