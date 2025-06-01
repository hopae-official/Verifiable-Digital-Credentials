import {
  AuthorizationCodeGrant,
  AuthorizationServerMetadata,
  CredentialIssuerMetadata,
  CredentialOffer,
  isPreAuthorizedCodeGrant,
} from '@vdcs/oid4vci';
import axios from 'axios';

export const parseCredentialOfferUrl = async (
  url: string,
): Promise<CredentialOffer> => {
  const { searchParams } = new URL(url, 'openid-credential-offer://');
  const credentialOffer = searchParams.get('credential_offer');
  if (credentialOffer) {
    return JSON.parse(decodeURIComponent(credentialOffer)) as CredentialOffer;
  }

  const credentialOfferUri = searchParams.get('credential_offer_uri');
  if (credentialOfferUri) {
    const requestUri = decodeURIComponent(credentialOfferUri);
    const response = await axios.get<CredentialOffer>(requestUri);
    return response.data;
  }

  throw new Error('Invalid credential offer');
};

export const buildCredentialIssuerWellKnownUrl = (
  issuerUrl: string,
): string => {
  // Remove any trailing slash from the identifier
  const cleanedIdentifier = issuerUrl.replace(/\/$/, '');
  return `${cleanedIdentifier}/.well-known/openid-credential-issuer`;
};

export const fetchCredentialIssuerMetadata = async (
  issuerUrl: string,
): Promise<CredentialIssuerMetadata> => {
  const url = buildCredentialIssuerWellKnownUrl(issuerUrl);
  const response = await axios.get<CredentialIssuerMetadata>(url);
  return response.data;
};

export const getAuthorizationServerUrl = (
  credentialOffer: CredentialOffer,
  metadata: CredentialIssuerMetadata,
) => {
  const { authorization_servers, credential_issuer } = metadata;

  if (!authorization_servers || authorization_servers.length === 0) {
    return credential_issuer;
  }

  const offerAuthServer = isPreAuthorizedCodeGrant(credentialOffer)
    ? credentialOffer.grants?.[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ].authorization_server
    : (credentialOffer.grants as AuthorizationCodeGrant)?.['authorization_code']
        ?.authorization_server;

  if (offerAuthServer && authorization_servers.includes(offerAuthServer)) {
    return offerAuthServer;
  }

  return authorization_servers[0];
};

export const fetchAuthorizationServerMetadata = async (
  authorizationServerUrl: string,
): Promise<AuthorizationServerMetadata> => {
  const cleanedIdentifier = authorizationServerUrl.replace(/\/$/, '');
  const url = `${cleanedIdentifier}/.well-known/oauth-authorization-server`;
  const response = await axios.get<AuthorizationServerMetadata>(url);
  return response.data;
};
