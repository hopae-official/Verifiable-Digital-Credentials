import { Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NonceService } from './nonce.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nonceService: NonceService,
  ) {}

  @Get('.well-known/oauth-authorization-server')
  getAuthorizationServerMetadata() {
    return this.appService.getAuthorizationServerMetadata();
  }

  @Get('.well-known/openid-credential-issuer')
  async getMetadata() {
    return this.appService.getCredentialMetadata();
  }

  @Header('Cache-Control', 'no-store')
  @Post('nonce')
  async createNonce() {
    return this.nonceService.createNonce();
  }
}
