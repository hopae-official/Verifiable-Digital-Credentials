import axios from 'axios';
import {
  CredentialOffer,
  CredentialResponse,
  CredentialIssuerMetadata,
  AuthorizationServerMetadata,
  isPreAuthorizedCodeGrant,
  PreAuthorizedCodeGrant,
  TokenResponseDto,
} from '@vdcs/oid4vci';
import {
  fetchCredentialIssuerMetadata,
  getAuthorizationServerUrl,
  fetchAuthorizationServerMetadata,
  parseCredentialOfferUrl,
} from './utils';
import { Status } from './type';
import { type EcPrivateJwk, signJWT } from '@vdcs/jwt';

export class Oid4VciClient {
  public credentialOffer: CredentialOffer;
  public credentialIssuerMetadata: CredentialIssuerMetadata;
  public authorizationServerMetadata: AuthorizationServerMetadata;

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

  private createProofJwt(c_nonce: string, privateKey: EcPrivateJwk): string {
    const header = {
      alg: 'ES256',
      typ: 'openid4vci-proof+jwt',
      jwk: {
        kty: 'EC',
        crv: 'P-256',
        x: privateKey.x,
        y: privateKey.y,
      },
    };
    const payload = {
      aud: this.credentialIssuerMetadata.credential_issuer,
      nonce: c_nonce,
      iat: Math.floor(Date.now() / 1000),
    };
    const jwt = signJWT({ header, payload }, privateKey);
    return jwt;
  }

  async getCredential(payload: {
    credential_configuration_id?: string;
    tx_code?: string;
    privateKey: EcPrivateJwk;
  }): Promise<CredentialResponse> {
    const tokenEndpoint = this.authorizationServerMetadata.token_endpoint;
    const preAuthorizedCode = (
      this.credentialOffer.grants as PreAuthorizedCodeGrant
    )?.['urn:ietf:params:oauth:grant-type:pre-authorized_code'][
      'pre-authorized_code'
    ];

    const {
      data: { access_token, c_nonce },
    } = await axios.post<TokenResponseDto & { c_nonce: string }>(
      tokenEndpoint,
      {
        grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
        'pre-authorized_code': preAuthorizedCode,
        tx_code: payload.tx_code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    this.accessToken = access_token;

    const proofJwt = this.createProofJwt(c_nonce, payload.privateKey);

    const credentialEndpoint =
      this.credentialIssuerMetadata.credential_endpoint;

    const { data } = await axios.post<CredentialResponse>(
      credentialEndpoint,
      {
        credential_configuration_id: payload.credential_configuration_id,
        proof: {
          proof_type: 'jwt',
          jwt: proofJwt,
        },
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
