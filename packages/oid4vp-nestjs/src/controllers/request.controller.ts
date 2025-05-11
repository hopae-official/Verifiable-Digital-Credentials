import { Controller, Get, Post } from '@nestjs/common';
import { Oid4VpService } from '../services/oid4vp.service';

@Controller('oid4vp')
export class RequestController {
  constructor(private readonly oid4vpService: Oid4VpService) {}

  // fallback
  @Get('request')
  requestGet() {
    return this.oid4vpService.getRequestString();
  }

  @Post('request')
  requestPost() {
    return this.oid4vpService.getRequest();
  }
}
