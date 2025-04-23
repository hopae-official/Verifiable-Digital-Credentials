import { randomUUID } from 'crypto';

export function generatePreAuthorizedCode(): string {
  return randomUUID();
}

export function generateCredentialOfferUri(offer: any, config: any): string {
  const encoded = encodeURIComponent(JSON.stringify(offer));
  return `${config.issuer}/credential-offer?credential_offer=${encoded}`;
}
