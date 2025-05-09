export interface AuthorizationDetails {
  type: 'openid_credential';
  credential_configuration_id: string;
}

export interface AuthorizationRequest {
  response_type: 'code';
  client_id: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  authorization_details?: AuthorizationDetails[];
  scope?: string;
  redirect_uri: string;
  resource?: string;
  issuer_state?: string;
  wallet_issuer?: string;
  user_hint?: string;
  nonce?: string;
}
