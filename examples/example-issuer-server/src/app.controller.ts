import { Controller, Get, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NonceService } from './nonce.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nonceService: NonceService,
  ) {}

  @Header('Cache-Control', 'no-store')
  @Post('nonce')
  async createNonce() {
    return this.nonceService.createNonce();
  }
}
