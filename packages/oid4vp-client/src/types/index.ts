export type CredentialQuery = {
  id?: string;
  format?: string;
  multiple?: boolean;
  trusted_authorities?: {
    type: 'aki' | 'etsi_tl' | 'openid_federation';
    values: string[];
  }[];
  require_cryptographic_holder_binding?: boolean;
  claims?: {
    id?: string;
    path: string[];
    values?: any[];
  }[];
};

export type DcqlQuery = {
  credentials?: CredentialQuery[];
  credential_sets?: {
    options: {
      credentials: CredentialQuery[];
      required?: boolean;
    }[];
  }[];
};

export type AuthorizationRequest = {
  response_type: 'vp_token';
  client_id: string;
  redirect_uri: string;
  nonce: string;
  dcql_query?: DcqlQuery;
  scope?: string;
  response_mode?: 'direct_post' | 'form_post';
  state?: string;
  client_metadata?: {
    jwks?: object;
    encrypted_response_enc_values_supported?: string[];
    vp_formats_supported?: string[];
  };
};

export type AuthorizationResponse = {
  vp_token: string;
  presentation_submission?: object;
  state?: string;
};

export type SendAuthorizationResponseOptions = {
  responseUri: string;
  vpToken: string;
  state?: string;
  responseMode?: 'direct_post' | 'form_post';
};
