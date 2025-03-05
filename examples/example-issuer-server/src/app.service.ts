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
      credential_configurations_supported: {}, // TODO: implement
      display: [
        {
          name: 'Example Issuer',
          locale: 'en',
        },
      ],
    };
  }
}
