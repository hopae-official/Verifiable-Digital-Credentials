import { Controller, Get, Header, Post } from '@nestjs/common';
import { Oid4VciService } from '../oid4vci.service';

@Controller('oid4vci')
export class Oid4VciController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @Get('.well-known/openid-credential-issuer')
  async wellKnown() {}

  @Header('Cache-Control', 'no-store')
  @Post('credential')
  async credential() {}
}
