export interface ProofOfPossession {
  proof_type: 'jwt';
  jwt: string;
}

export interface CredentialRequest {
  format: string;
  proof: ProofOfPossession;
  credential_configuration_id: string;
}

export interface CredentialResponse {
  format: string;
  credential: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
}

export interface CredentialConfiguration {
  id: string;
  format: string;
  types: string[];
  display?: DisplayProperties[];
  credentialSubject?: Record<string, any>;
  order?: string[];
}

export interface DisplayProperties {
  name: string;
  locale?: string;
  logo?: ImageObject;
  background_color?: string;
  text_color?: string;
}

export interface ImageObject {
  url: string;
  alt_text?: string;
}

export interface CredentialOfferOptions {
  issuer: string;
  configurationIds: string[];
  preAuthorizedCode?: string;
  userPinRequired?: boolean;
}

export interface CredentialOffer {
  credential_issuer: string;
  credentials: CredentialConfiguration[];
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: {
      'pre-authorized_code': string;
      user_pin_required: boolean;
    };
    'authorization_code'?: Record<string, never>;
  };
}

export interface TokenRequest {
  grant_type: 'authorization_code' | 'urn:ietf:params:oauth:grant-type:pre-authorized_code';
  code?: string;
  'pre-authorized_code'?: string;
  user_pin?: string;
  code_verifier?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  c_nonce?: string;
  c_nonce_expires_in?: number;
}

export interface ErrorResponse {
  error: string;
  error_description?: string;
  error_uri?: string;
}

export interface IssuerMetadata {
  credential_issuer: string;
  authorization_server?: string;
  credential_endpoint: string;
  batch_credential_endpoint?: string;
  deferred_credential_endpoint?: string;
  credential_configurations: Record<string, CredentialConfiguration>;
  display?: DisplayProperties[];
}