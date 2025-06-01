import axios from 'axios';
import {
  CredentialOffer,
  CredentialResponse,
  CredentialIssuerMetadata,
  AuthorizationServerMetadata,
  isPreAuthorizedCodeGrant,
  PreAuthorizedCodeGrant,
  AuthorizationDetail,
  TokenResponseDto,
} from '@vdcs/oid4vci';
import {
  fetchCredentialIssuerMetadata,
  getAuthorizationServerUrl,
  fetchAuthorizationServerMetadata,
  parseCredentialOfferUrl,
} from './utils';
import { Status } from './type';

export class Oid4VciClient {
  private credentialOffer: CredentialOffer;
  private credentialIssuerMetadata: CredentialIssuerMetadata;
  private authorizationServerMetadata: AuthorizationServerMetadata;

  private status: Status;
  private accessToken?: string;
  private credentialResponse?: CredentialResponse;

  constructor(data: {
    credentialOffer: CredentialOffer;
    metadata: {
      credentialIssuer: CredentialIssuerMetadata;
      authorizationServer: AuthorizationServerMetadata;
    };
  }) {
    this.credentialOffer = data.credentialOffer;
    this.credentialIssuerMetadata = data.metadata.credentialIssuer;
    this.authorizationServerMetadata = data.metadata.authorizationServer;

    const isPreAuthorized = isPreAuthorizedCodeGrant(this.credentialOffer);
    this.status = {
      type: 'init',
      data: {},
      flow: isPreAuthorized ? 'pre-authorized_code' : 'authorization_code',
    };
  }

  public getStatus(): Status {
    return this.status;
  }

  static async fromOfferUrl(offerUrl: string) {
    const credentialOffer = await parseCredentialOfferUrl(offerUrl);
    const { credential_issuer } = credentialOffer;

    const credentialIssuerMetadata =
      await fetchCredentialIssuerMetadata(credential_issuer);

    const authorizationServerUrl = getAuthorizationServerUrl(
      credentialOffer,
      credentialIssuerMetadata,
    );

    const authorizationServerMetadata = await fetchAuthorizationServerMetadata(
      authorizationServerUrl,
    );

    return new Oid4VciClient({
      credentialOffer,
      metadata: {
        credentialIssuer: credentialIssuerMetadata,
        authorizationServer: authorizationServerMetadata,
      },
    });
  }

  async getCredential(payload: {
    credential_configuration_id?: string;
    tx_code?: string;
    // TODO: add proof
  }): Promise<CredentialResponse> {
    const tokenEndpoint = this.authorizationServerMetadata.token_endpoint;
    const preAuthorizedCode = (
      this.credentialOffer.grants as PreAuthorizedCodeGrant
    )?.['urn:ietf:params:oauth:grant-type:pre-authorized_code'][
      'pre-authorized_code'
    ];

    const authorizationDetails: AuthorizationDetail[] | undefined =
      payload.credential_configuration_id
        ? [
            {
              type: 'openid_credential',
              credential_configuration_id: payload.credential_configuration_id,
            },
          ]
        : undefined;

    const {
      data: { access_token },
    } = await axios.post<TokenResponseDto>(
      tokenEndpoint,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code': preAuthorizedCode,
        tx_code: payload.tx_code,
        authorization_details: authorizationDetails,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    this.accessToken = access_token;

    const credentialEndpoint =
      this.credentialIssuerMetadata.credential_endpoint;

    const { data } = await axios.post<CredentialResponse>(
      credentialEndpoint,
      {
        credential_configuration_id: payload.credential_configuration_id, // TODO: fix
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    this.credentialResponse = data;
    return data;
  }
}
