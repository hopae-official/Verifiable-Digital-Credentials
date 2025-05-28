import axios, { AxiosInstance } from 'axios';
import {
  CredentialOffer,
  CredentialResponse,
  CredentialIssuerMetadata,
  AuthorizationServerMetadata,
} from '@vdcs/oid4vci';

export class Oid4VciClient {
  private axios: AxiosInstance;
  private currentOffer: CredentialOffer | null = null;
  private credentialIssuerMetadata: CredentialIssuerMetadata | null = null;
  private authorizationServerMetadata: AuthorizationServerMetadata | null =
    null;

  constructor() {
    this.axios = axios.create();
  }

  async fetchCredentialIssuerMetadata(issuerUrl: string): Promise<CredentialIssuerMetadata> {
    const url = `${issuerUrl}/.well-known/openid-credential-issuer`;
    const response = await this.axios.get<CredentialIssuerMetadata>(url);
    this.credentialIssuerMetadata = response.data;
    return response.data;
  }

  async fetchAuthorizationServerMetadata(issuerUrl: string): Promise<AuthorizationServerMetadata> {
    const url = `${issuerUrl}/.well-known/oauth-authorization-server`;
    const response = await this.axios.get<AuthorizationServerMetadata>(url);
    this.authorizationServerMetadata = response.data;
    return response.data;
  }

  async getAccessToken(
    preAuthorizedCode: string,
    txCode: string,
  ): Promise<string> {
    if (!this.authorizationServerMetadata) {
      throw new Error(
        'Metadata not loaded. Call fetchAuthorizationServerMetadata() first.',
      );
    }

    const response = await this.axios.post(
      this.authorizationServerMetadata.token_endpoint,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        pre_authorized_code: preAuthorizedCode,
        tx_code: txCode,
      },
    );

    return response.data.access_token;
  }

  async requestCredential(
    accessToken: string,
    credentialType: string,
  ): Promise<CredentialResponse> {
    if (!this.credentialIssuerMetadata) {
      throw new Error('Metadata not loaded. Call fetchMetadata() first.');
    }

    const response = await this.axios.post(
      this.credentialIssuerMetadata.credential_endpoint,
      {
        credential_identifier: credentialType,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }
}
