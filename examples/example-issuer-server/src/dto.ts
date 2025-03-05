export class TokenDto {
  grant_type:
    | 'authorization_code'
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  pre_authorized_code: string;
  tx_code?: string;
  authorization_details?: string;
}

export class CredentialDto {
  credential_identifier: string;
  // TODO: add proof
}
