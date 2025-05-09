import { Controller, Get, Post, Header, Query, Redirect } from '@nestjs/common';
import { Oid4VciService } from '../services/oid4vci.service';
import { AuthorizationRequest } from '@vdcs/oid4vci';

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

  @Get('authorize')
  @Redirect()
  authorize(@Query() authRequest: AuthorizationRequest) {
    return this.oid4vciService.authorize(authRequest);
  }

  @Header('Cache-Control', 'no-store')
  @Post('credential')
  async credential() {}
}
