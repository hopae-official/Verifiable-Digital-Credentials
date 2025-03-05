import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenDto } from './dto';
import * as jwt from 'jsonwebtoken';
import { createPrivateKey, createPublicKey, KeyObject } from 'crypto';

@Injectable()
export class TokenService {
  private readonly credentialIssuer: string;
  private priKey: KeyObject;
  private pubKey: KeyObject;

  constructor(private readonly configService: ConfigService) {
    this.credentialIssuer = this.configService.getOrThrow('ISSUER');
    const jwkStr = this.configService.get('JWK');
    const jwk = JSON.parse(jwkStr);
    this.priKey = createPrivateKey({
      key: { ...jwk, kty: 'EC' },
      format: 'jwk',
    });
    this.pubKey = createPublicKey(this.priKey);
  }

  createToken(dto: TokenDto) {
    if (
      dto.pre_authorized_code !== '8swr2odf8sd2ndokdg' ||
      dto.tx_code !== '1111'
    ) {
      throw new BadRequestException({
        error: 'invalid_request',
      });
    }

    const payload = {
      iss: this.credentialIssuer,
      sub: 'sub-1234',
    };
    const access_token = jwt.sign(payload, this.priKey, {
      algorithm: 'ES256',
      expiresIn: '1h',
    });

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: 3600,
      authorization_details: [
        {
          type: 'openid_credential',
          credential_configuration_id: 'UniversityDegreeCredential',
          credential_identifier: ['EngineeringDegree-2025'],
        },
      ],
    };
  }

  verifyToken(token: string) {
    const payload = jwt.verify(token, this.pubKey, {
      algorithms: ['ES256'],
    });
    return payload;
  }
}
