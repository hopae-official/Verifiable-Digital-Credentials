import { Controller, Get, Header, Post } from '@nestjs/common';
import { Oid4VciService } from '../services/oid4vci.service';

@Controller('oid4vci')
export class Oid4VciController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @Get('.well-known/openid-credential-issuer')
  wellKnown() {
    return this.oid4vciService.getIssuerMetadata();
  }

  @Get('.well-known/oauth-authorization-server')
  getAuthorizationServerMetadata() {
    return this.oid4vciService.getAuthorizationServerMetadata();
  }

  @Header('Cache-Control', 'no-store')
  @Post('credential')
  async credential() {}
}
