import { Controller, Header, Post } from '@nestjs/common';
import { Oid4VciService } from '../services/oid4vci.service';

@Controller('oid4vci')
export class TokenController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @Header('Cache-Control', 'no-store')
  @Post('token')
  async token() {}
}
