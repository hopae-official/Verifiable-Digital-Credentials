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
import { TokenDto } from '../dto/token.dto';

@Controller('oid4vci')
export class TokenController {
  constructor(private readonly oid4vciService: Oid4VciService) {}

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @Post('token')
  async token(@Body() body: TokenDto) {
    return this.oid4vciService.generateToken(body);
  }
}
