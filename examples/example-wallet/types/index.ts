export type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: Array<string>;
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
      'pre-authorized_code': string;
      tx_code: {
        length: number;
        input_mode: string;
        descreption: string;
      };
    };
  };
};