import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Headers,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { NonceService } from './nonce.service';
import { TokenService } from './token.service';
import { CredentialDto, TokenDto } from './dto';
import { CredentialService } from './credential.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nonceService: NonceService,
    private readonly tokenService: TokenService,
    private readonly credentialService: CredentialService,
  ) {}

  @Get('healthcheck')
  healthcheck() {
    return 'OK';
  }

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
    if (
      dto.grant_type !== 'urn:ietf:params:oauth:grant-type:pre-authorized_code'
    ) {
      throw new BadRequestException({
        error: 'invalid_grant',
      });
    }
    return this.tokenService.createToken(dto);
  }

  @Get('start')
  async getStart() {
    return this.credentialService.getStart();
  }

  @Get('credential-offer')
  async getCredentialOffer() {
    return this.credentialService.getOffer();
  }

  @Header('Cache-Control', 'no-store')
  @Post('credential')
  async createCredential(
    @Body() dto: CredentialDto,
    @Headers('Authorization') bearer: string,
  ) {
    this.tokenService.verifyToken(bearer.split(' ')[1]);
    return this.credentialService.create(dto);
  }
}
