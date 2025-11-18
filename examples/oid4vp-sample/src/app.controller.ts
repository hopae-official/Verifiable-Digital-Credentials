import { Controller, Get } from '@nestjs/common';
import { Oid4VpService } from '@vdcs/oid4vp-nestjs';

@Controller()
export class AppController {
  constructor(private readonly oid4VpService: Oid4VpService) {}

  @Get()
  async getTestRoute() {
    await this.oid4VpService.getRequestString();
  }
}
