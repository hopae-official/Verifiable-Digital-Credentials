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

  @Post('request/:type/:id')
  request(@Param('type') type: string, @Param('id') id: string) {
    return this.appService.request(type, id);
  }

  @Post('response/:id')
  response(@Param('id') id: string, @Body('vp_token') vp_token: string) {
    return this.appService.response(id, vp_token);
  }

  @Get('status/:id')
  status(@Param('id') id: string) {
    return this.appService.status(id);
  }
}
