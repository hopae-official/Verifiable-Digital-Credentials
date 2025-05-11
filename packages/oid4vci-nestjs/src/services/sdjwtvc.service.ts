import { Inject, Injectable } from '@nestjs/common';
import { OID4VCI_OPTIONS } from '../constant';
import { Oid4VciOptions } from '../types/module';
import {
  constants,
  KeyObject,
  createSign,
  createPrivateKey,
} from 'node:crypto';
import { SDJwtInstance } from '@sd-jwt/core';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';
import { DisclosureFrame } from '@sd-jwt/types';

@Injectable()
export class SdjwtvcService {
  private sdjwtvcInstance: SDJwtInstance<Record<string, unknown>>;

  constructor(
    @Inject(OID4VCI_OPTIONS)
    private readonly options: Oid4VciOptions,
  ) {
    const key = this.options.jwks.keys[0];
    const privateKey = createPrivateKey({ key, format: 'jwk' });
    const alg = this.options.jwks.algorithm as Alg;

    this.sdjwtvcInstance = new SDJwtInstance({
      hashAlg: 'sha-256',
      hasher: digest,
      saltGenerator: generateSalt,
      signAlg: alg,
      signer: (data: string) => {
        return JWTSigner.sign(alg, data, privateKey);
      },
    });
  }

  async sign<T extends Record<string, unknown>>(
    payload: T,
    vct: string,
    disclosureFrame?: DisclosureFrame<T>,
  ) {
    return this.sdjwtvcInstance.issue(
      { ...payload, vct, iss: this.options.meta.credential_issuer },
      disclosureFrame,
    );
  }
}

export const ALGORITHMS = {
  // RSA
  RS256: { hash: 'sha256', padding: constants.RSA_PKCS1_PADDING },
  RS384: { hash: 'sha384', padding: constants.RSA_PKCS1_PADDING },
  RS512: { hash: 'sha512', padding: constants.RSA_PKCS1_PADDING },

  // RSA-PSS
  PS256: { hash: 'sha256', padding: constants.RSA_PKCS1_PSS_PADDING },
  PS384: { hash: 'sha384', padding: constants.RSA_PKCS1_PSS_PADDING },
  PS512: { hash: 'sha512', padding: constants.RSA_PKCS1_PSS_PADDING },

  // ECDSA
  ES256: { hash: 'sha256', namedCurve: 'P-256' },
  ES384: { hash: 'sha384', namedCurve: 'P-384' },
  ES512: { hash: 'sha512', namedCurve: 'P-521' },

  // EdDSA
  EdDSA: { curves: ['ed25519', 'ed448'] },
};

export type Alg = keyof typeof ALGORITHMS;

class JWTSigner {
  static sign(alg: Alg, signingInput: string, privateKey: KeyObject) {
    const signature = this.createSignature(alg, signingInput, privateKey);
    return signature;
  }

  static createSignature(
    alg: Alg,
    signingInput: string,
    privateKey: KeyObject,
  ) {
    switch (alg) {
      case 'RS256':
      case 'RS384':
      case 'RS512':
      case 'PS256':
      case 'PS384':
      case 'PS512': {
        const option = ALGORITHMS[alg];
        return this.createRSASignature(signingInput, privateKey, option);
      }
      case 'ES256':
      case 'ES384':
      case 'ES512': {
        const option = ALGORITHMS[alg];
        return this.createECDSASignature(signingInput, privateKey, option);
      }
      case 'EdDSA': {
        const option = ALGORITHMS[alg];
        return this.createEdDSASignature(signingInput, privateKey, option);
      }
      default:
    }
    throw new Error(`Unsupported algorithm: ${alg}`);
  }

  static createRSASignature(
    signingInput: string,
    privateKey: KeyObject,
    options: { hash: string; padding: number },
  ) {
    const signer = createSign(options.hash);
    signer.update(signingInput);
    const signature = signer.sign({
      key: privateKey,
      padding: options.padding,
    });
    return signature.toString('base64url');
  }

  static createECDSASignature(
    signingInput: string,
    privateKey: KeyObject,
    options: { hash: string; namedCurve: string },
  ) {
    const signer = createSign(options.hash);
    signer.update(signingInput);

    let signature = signer.sign({
      key: privateKey,
      dsaEncoding: 'ieee-p1363',
    });

    return signature.toString('base64url');
  }

  static createEdDSASignature(
    signingInput: string,
    privateKey: KeyObject,
    options: { curves: string[] },
  ) {
    const signer = createSign(options.curves[0]);
    signer.update(signingInput);
    const signature = signer.sign({
      key: privateKey,
    });
    return signature.toString('base64url');
  }
}
