import { Oid4VciClient } from '@vdcs/oid4vci-client';

async function run() {
  const offerUri =
    'openid-credential-offer://?credential_offer_uri=https%3A%2F%2Ffunke.animo.id%2Foid4vci%2F188e2459-6da8-4431-9062-2fcdac274f41%2Foffers%2F74bf73bc-67f8-482c-9741-492c8fe823ba';
  const client = await Oid4VciClient.fromOfferUrl(offerUri);
  console.log({
    client: client.credentialIssuerMetadata,
    credentialOffer: client.credentialOffer,
  });

  const jwk = {
    kty: 'EC',
    d: 'hUQznqxINndxBHI8hMHvQmgSjYOCSqLUwMtzWCrh4ow',
    crv: 'P-256',
    x: 'ifSgGMkEIEDPsxFxdOjeJxhYsz0STsTT5bni_MXNEJs',
    y: 'viFDEvB61K6zuj2iq23j0FCmVYYQ8tGJ_3f35XXUDZ0',
  } as const;

  const result = await client.getCredential({
    credential_configuration_id:
      client.credentialOffer.credential_configuration_ids[0],
    privateKey: jwk,
  });
  console.log({ result });
}

run().catch(console.error);
