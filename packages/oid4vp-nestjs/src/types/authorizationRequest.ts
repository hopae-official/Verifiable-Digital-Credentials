import { JsonWebKey } from 'node:crypto';

export type AuthorizationRequest = {
  nonce: string;
  scope?: string;
  response_mode: 'direct_post';
  response_type: 'vp_token';
  response_uri: string;
  client_id: string;
  state?: string;

  dcql_query: any; // TODO: define
  client_metadata?: {
    jwks?: Array<JsonWebKey>;
    encrypted_response_enc_values_supported?: string[];
    vp_formats_supported: Record<string, unknown>; // TODO: define
  };

  request_uri?: string;
  request_uri_method?: 'get' | 'post';

  transaction_data?: string[];
  verifier_attestations?: Array<{
    format: string;
    data: string;
    credential_ids: string[];
  }>;
};
