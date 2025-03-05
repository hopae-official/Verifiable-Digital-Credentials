import { Injectable } from '@nestjs/common';
import { CredentialDto } from './dto';
import { ConfigService } from '@nestjs/config';

function createOpenIdCredentialOfferUrl(credentialOfferUri: string): string {
  const encodedUri = encodeURIComponent(credentialOfferUri);
  const baseSchema = 'openid-credential-offer://';
  return `${baseSchema}?credential_offer_uri=${encodedUri}`;
}

@Injectable()
export class CredentialService {
  private readonly credentialIssuer: string;

  constructor(private readonly configService: ConfigService) {
    this.credentialIssuer = this.configService.getOrThrow('ISSUER');
  }

  create(dto: CredentialDto) {
    return {
      credentials: [
        {
          credential: '', // TODO: fill in
        },
      ],
    };
  }

  getOffer() {
    return {
      credential_issuer: this.credentialIssuer,
      credential_configuration_ids: ['UniversityDegreeCredential'],
      grants: {
        'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
          'pre-authorized_code': '8swr2odf8sd2ndokdg',
          tx_code: {
            length: 4,
            input_mode: 'numeric',
            description:
              'Please provide the one-time code that was sent via e-mail',
          },
        },
      },
    };
  }

  getStart() {
    const credentialEndpoint = `${this.credentialIssuer}/credential`;
    const link = createOpenIdCredentialOfferUrl(credentialEndpoint);
    return {
      link,
    };
  }
}
