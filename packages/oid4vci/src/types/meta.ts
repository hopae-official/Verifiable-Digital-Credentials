import { CredentialConfigurationSupported } from './credential_configurations_supported';

export type CredentialIssuerMetadata = {
  credential_issuer: string;
  authorization_servers?: string[];
  credential_endpoint: string;
  nonce_endpoint?: string;
  deferred_credential_endpoint?: string;
  notification_endpoint?: string;
  credential_response_encryption?: {
    batch_size: number;
  };
  signed_metadata?: string;
  display: Array<{ name: string; locale: string; logo?: { uri: string } }>;
  credential_configurations_supported: {
    [credentialConfigurationId: string]: CredentialConfigurationSupported;
  };
};

/**
 * @Reference - https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#RFC8414
 * @Description - Authorization Server Metadata defined on RFC8414
 */
export interface AuthorizationServerMetadata {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri?: string;
  registration_endpoint?: string;
  scopes_supported?: string[];
  response_types_supported: string[];
  response_modes_supported?: string[];
  grant_types_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
  token_endpoint_auth_signing_alg_values_supported?: string[];
  service_documentation?: string;
  ui_locales_supported?: string[];
  op_policy_uri?: string;
  op_tos_uri?: string;
  revocation_endpoint?: string;
  revocation_endpoint_auth_methods_supported?: string[];
  revocation_endpoint_auth_signing_alg_values_supported?: string[];
  introspection_endpoint?: string;
  introspection_endpoint_auth_methods_supported?: string[];
  introspection_endpoint_auth_signing_alg_values_supported?: string[];
  code_challenge_methods_supported?: string[];
  'pre-authorized_grant_anonymous_access_supported'?: boolean;
}
