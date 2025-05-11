export class TokenDto {
  grant_type:
    | 'authorization_code'
    | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';

  // for authorization_code
  code?: string;
  code_verifier?: string;
  redirect_uri?: string;
  client_assertion_type?: string;
  client_assertion?: string;

  // for pre-authorized_code
  'pre-authorized_code'?: string;
  tx_code?: string;
}
