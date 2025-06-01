import axios from 'axios';
import {
  CredentialOffer,
  CredentialResponse,
  CredentialIssuerMetadata,
  AuthorizationServerMetadata,
  isPreAuthorizedCodeGrant,
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
}
