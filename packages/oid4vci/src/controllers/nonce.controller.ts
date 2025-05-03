import { Controller, Header, Post } from '@nestjs/common';
import { Oid4VciService } from '../oid4vci.service';

@Controller('oid4vci')
export class NonceController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @Header('Cache-Control', 'no-store')
  @Post('nonce')
  async nonce() {}
}
