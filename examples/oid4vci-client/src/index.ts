import { Oid4VciClient } from '@vdcs/oid4vci-client';
import {
  CredentialOffer,
  PreAuthorizedCodeGrant,
  isPreAuthorizedCodeGrant,
} from '@vdcs/oid4vci';

async function run() {
  const issuerUrl = 'https://issuer.dev.hopae.com';
  const txCode = '1111';
  const credentialType = 'UniversityDegreeCredential';

  const client = new Oid4VciClient(issuerUrl);

  const credentialOffer = await client.fetchCredentialOffer();
  console.log('Credential Offer:', credentialOffer);

  const credentialIsserMetadata = await client.fetchCredentialIssuerMetadata();
  console.log('Credential Issuer Metadata:', credentialIsserMetadata);

  const authorizationServerMetadata =
    await client.fetchAuthorizationServerMetadata();
  console.log('Authorization Server Metadata:', authorizationServerMetadata);

  if (isPreAuthorizedCodeGrant(credentialOffer)) {
    const preAuthorizedGrant =
      credentialOffer.grants[
        'urn:ietf:params:oauth:grant-type:pre-authorized_code'
      ];

    // @Todo: fix type after server url replaced ("pre-authorized_code" is used in "example-issuer-server")
    const preAuthorizedCode = (preAuthorizedGrant as any)[
      'pre-authorized_code'
    ];

    console.log('Pre-authorized code:', preAuthorizedCode, preAuthorizedGrant);

    const accessToken = await client.getAccessToken(preAuthorizedCode, txCode);
    console.log('Access Token:', accessToken);

    const credential = await client.requestCredential(
      accessToken,
      credentialType,
    );
    console.log('Credential:', credential);
  } else {
    // @Todo: handle authorization flow
  }
}

run().catch(console.error);
