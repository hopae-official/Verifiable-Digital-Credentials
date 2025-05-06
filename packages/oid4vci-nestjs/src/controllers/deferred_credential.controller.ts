import {
  Body,
  Controller,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Oid4VciService } from '../services/oid4vci.service';
import {
  DeferredCredentialDto,
  DeferredCredentialResponseDto,
} from '../dto/deferredCredential.dto';

@Controller('oid4vci')
export class DeferredCredentialController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @Post('deferred_credential')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async deferredCredential(
    @Body() body: DeferredCredentialDto,
  ): Promise<DeferredCredentialResponseDto> {
    return this.oid4vciService.deferredCredential(body.transaction_id);
  }
}
