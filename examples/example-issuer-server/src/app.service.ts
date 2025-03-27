import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly credentialIssuer: string;
  private readonly jwks: JsonWebKey[];

  constructor(private readonly configService: ConfigService) {
    this.credentialIssuer = this.configService.getOrThrow('ISSUER');
    this.jwks = [JSON.parse(this.configService.getOrThrow('PUB_JWK'))];
  }

  getJwks() {
    return {
      keys: this.jwks,
    };
  }

  getAuthorizationServerMetadata() {
    return {
      issuer: this.credentialIssuer,
      authorization_endpoint: '', // TODO: implement
      token_endpoint: `${this.credentialIssuer}/token`,
      jwks_uri: `${this.credentialIssuer}/.well-known/jwks.json`,
    };
  }

  getCredentialMetadata() {
    return {
      credential_issuer: this.credentialIssuer,
      credential_endpoint: `${this.credentialIssuer}/credential`,
      nonce_endpoint: `${this.credentialIssuer}/nonce`,
      credential_configurations_supported: {
        UniversityDegreeCredential: {
          format: 'dc+sd-jwt',
          display: [
            {
              name: 'Hopae University Degree',
              locale: 'en',
            },
          ],
        },
        VaccinationCredential: {
          format: 'dc+sd-jwt',
          display: [
            {
              name: 'Vaccination Certificate',
              locale: 'en',
            },
          ],
        },
        DriverLicenseCredential: {
          format: 'mso_mdoc',
          display: [
            {
              name: 'Driver License',
              locale: 'en',
            },
          ],
        },
      },
      display: [
        {
          name: 'Hopae Demo Issuer',
          locale: 'en',
          logo: {
            uri: 'https://static.hopae.com/images/wallets/hopae.png',
          },
        },
      ],
    };
  }
}
