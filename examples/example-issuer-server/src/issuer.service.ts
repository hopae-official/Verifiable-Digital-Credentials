import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPrivateKey, createSign, KeyObject } from 'crypto';
import { SDJwtVcInstance } from '@sd-jwt/sd-jwt-vc';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';

type Credential = {
  name: string;
  birthdate: string;
};

type VC = {
  vct: string;
  iss: string;
};

@Injectable()
export class IssuerService {
  private priKey: KeyObject;
  private sdJwtInstance: SDJwtVcInstance;
  private credentialIssuer: string;

  constructor(private readonly configService: ConfigService) {
    this.credentialIssuer = this.configService.getOrThrow('ISSUER');
    const jwkStr = this.configService.get('JWK');
    const jwk = JSON.parse(jwkStr);
    this.priKey = createPrivateKey({
      key: { ...jwk, kty: 'EC' },
      format: 'jwk',
    });

    this.sdJwtInstance = new SDJwtVcInstance({
      hashAlg: 'sha-256',
      hasher: digest,
      saltGenerator: generateSalt,
      signAlg: 'ES256',
      signer: this.signer.bind(this),
    });
  }

  private signer(data: string): string {
    const signer = createSign('SHA256');

    // Update the signer with the data
    signer.update(data);

    // Sign the data and get the signature in DER format

    const signature = signer.sign({
      key: this.priKey,
      dsaEncoding: 'ieee-p1363', // Use raw format (r || s) for ES256
    });

    // Convert the signature to base64url encoding
    // base64url is base64 with '+' replaced by '-', '/' replaced by '_', and no padding '='
    return signature
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async createVc() {
    const vc = await this.sdJwtInstance.issue<Credential & VC>(
      {
        name: 'John Doe',
        birthdate: '1990-01-01',
        vct: `${this.credentialIssuer}/credentials/types/university`,
        iss: this.credentialIssuer,
      },
      { _sd: ['name', 'birthdate'] },
    );
    return vc;
  }
}
