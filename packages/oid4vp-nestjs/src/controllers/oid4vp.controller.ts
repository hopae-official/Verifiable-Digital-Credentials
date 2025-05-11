import { Body, Controller, Post } from '@nestjs/common';
import { Oid4VpService } from '../services/oid4vp.service';
import { VpToken } from '../types/vp_token';

@Controller('oid4vp')
export class Oid4VpController {
  constructor(private readonly oid4vpService: Oid4VpService) {}

  @Post('verify')
  async verifyVpToken(@Body() vp_token: VpToken) {
    return this.oid4vpService.verifyVpToken(vp_token);
  }
}
