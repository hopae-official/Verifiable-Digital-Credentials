import { Injectable } from '@nestjs/common';
import { CredentialProvider } from '../iservice';
import { CredentialOffer } from '../types/credential_offer';
import { SignOptions } from 'jsonwebtoken';

@Injectable()
export class CredentialService implements CredentialProvider {
  private readonly credentialOfferMap = new Map<string, CredentialOffer>();
  private readonly nonceSet = new Set<string>();

  async issueCredential(): Promise<void> {
    return; // TODO: implement
  }

  async registerCredentialOffer(
    key: string,
    credential_offer: CredentialOffer,
  ): Promise<void> {
    this.credentialOfferMap.set(key, credential_offer);
  }

  async findCredentialOffer(
    key: string,
  ): Promise<CredentialOffer | null | undefined> {
    const credentialOffer = this.credentialOfferMap.get(key);
    if (credentialOffer) {
      this.credentialOfferMap.delete(key);
    }
    return credentialOffer;
  }

  async registerNonce(
    nonce: string,
    ttl: SignOptions['expiresIn'],
  ): Promise<void> {
    this.nonceSet.add(nonce);
  }

  async findNonce(nonce: string): Promise<boolean> {
    const exists = this.nonceSet.has(nonce);
    if (exists) {
      this.nonceSet.delete(nonce);
    }
    return exists;
  }
}
