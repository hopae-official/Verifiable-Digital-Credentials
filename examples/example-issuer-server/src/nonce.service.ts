import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPrivateKey, KeyObject, randomUUID } from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class NonceService {
  private priKey: KeyObject;
  private nonceMap: Map<string, boolean>; // key = nonce, value = validity

  constructor(private readonly configService: ConfigService) {
    const jwkStr = this.configService.get('JWK');
    const jwk = JSON.parse(jwkStr);
    this.priKey = createPrivateKey({
      key: { ...jwk, kty: 'EC' },
      format: 'jwk',
    });
    this.nonceMap = new Map();
  }

  async createNonce() {
    const uuid = randomUUID();

    this.nonceMap.set(uuid, true);

    const nonce = jwt.sign(
      {
        iss: 'example-issuer',
        sub: 'example-subject',
        jti: uuid,
      },
      this.priKey,
      {
        expiresIn: '5m',
        algorithm: 'ES256',
      },
    );

    return { c_nonce: nonce };
  }

  async verifyNonce(nonce: string) {
    return this.nonceMap.get(nonce) === false;
  }

  async deleteNonce(nonce: string) {
    this.nonceMap.delete(nonce);
  }

  async markNonceAsUsed(nonce: string) {
    this.nonceMap.set(nonce, false);
  }
}
