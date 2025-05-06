import { Inject, Injectable } from '@nestjs/common';
import { OID4VCI_OPTIONS } from '../constant';
import { Oid4VciOptions } from '../types/module';
import jwt from 'jsonwebtoken';
import { createPrivateKey, createPublicKey } from 'node:crypto';

@Injectable()
export class JwtService {
  constructor(
    @Inject(OID4VCI_OPTIONS)
    private readonly options: Oid4VciOptions,
  ) {}

  getKid(token: string) {
    return jwt.decode(token, { complete: true })?.header.kid;
  }

  generateJwt(payload: Record<string, unknown>, kid?: string) {
    const { keys, algorithm } = this.options.jwks;
    const jwk = keys.find((jwk) => jwk.kid === kid) ?? keys[0];

    const privateKey = createPrivateKey({ key: jwk, format: 'jwk' });

    return jwt.sign(payload, privateKey, {
      algorithm,
      expiresIn: '1h',
      issuer: this.options.meta.credential_issuer,
      keyid: kid,
    });
  }

  verifyJwt(token: string, kid?: string) {
    const { keys, algorithm } = this.options.jwks;
    const jwk = keys.find((jwk) => jwk.kid === kid) ?? keys[0];

    const publicKey = createPublicKey({ key: jwk, format: 'jwk' });

    return jwt.verify(token, publicKey, {
      algorithms: [algorithm],
      issuer: this.options.meta.credential_issuer,
    });
  }
}
