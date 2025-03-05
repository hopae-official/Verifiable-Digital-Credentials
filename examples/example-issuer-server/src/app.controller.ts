import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { NonceService } from './nonce.service';
import { TokenService } from './token.service';
import { TokenDto } from './dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nonceService: NonceService,
    private readonly tokenService: TokenService,
  ) {}

  @Get('.well-known/oauth-authorization-server')
  getAuthorizationServerMetadata() {
    return this.appService.getAuthorizationServerMetadata();
  }

  @Get('.well-known/jwks.json')
  async getJwks() {
    return this.appService.getJwks();
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

  @Header('Cache-Control', 'no-store')
  @Post('token')
  async createToken(@Body() dto: TokenDto) {
    if (dto.grant_type !== 'authorization_code') {
      throw new BadRequestException({
        error: 'invalid_grant',
      });
    }
    return this.tokenService.createToken(dto);
  }
}
