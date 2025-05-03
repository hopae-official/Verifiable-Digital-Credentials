import { Controller, Get, Header, Param } from '@nestjs/common';
import { Oid4VciService } from '../oid4vci.service';

@Controller('oid4vci')
export class CredentialOfferUriController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @Header('Cache-Control', 'no-store')
  @Get('credential-offer/:key')
  async credentialOffer(@Param('key') key: string) {
    return this.oid4vciService.findCredentialOffer(key);
  }
}
