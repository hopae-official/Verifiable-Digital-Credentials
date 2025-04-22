import { JsonWebKey } from 'crypto';

export type OrPromise<T> = T | Promise<T>;

export type Oid4VciConfig = {
  /**
   * The Credential Issuer's identifier, typically a URL
   * @example "https://issuer.example.com"
   */
  credential_issuer: string;

  /**
   * List of OAuth 2.0 authorization server URLs
   * If not provided, the credential_issuer also serves as the authorization server
   * @example ["https://auth.example.com", "https://auth2.example.com"]
   * @optional
   */
  authorization_servers?: string[];

  credential_handler: (
    dto: CredentialRequestDto,
  ) => OrPromise<CredentialResponseDto>;

  nonce_handler?: () => OrPromise<NonceResponseDto>;

  deferred_credential_handler?: (
    dto: DeferredCredentialRequestDto,
  ) => OrPromise<DeferredCredentialResponseDto>;

  notification_handler?: (dto: NotificationRequestDto) => OrPromise<void>;

  credential_offer_handler?: (
    offerId: string,
  ) => OrPromise<CredentialOfferByValue>;

  token_handler?: (dto: TokenDto) => OrPromise<TokenResponseDto>;

  // TODO: implement
  credential_response_encryption?: never;

  batch_credential_issuance?: number;

  // TODO: implement
  signed_metadata_key?:
    | {
        alg: 'HS256';
        secret: string;
      }
    | {
        alg: 'ES256' | 'ES384' | 'ES512';
        key: JsonWebKey;
      };

  display?: Array<{
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }>;

  // TODO: implement
  credential_configurations_supported?: never;
};

export type NonceResponseDto = {
  c_nonce: string;
};

export type NotificationRequestDto = {
  notification_id: string;
  event: string;
};

export type DeferredCredentialRequestDto = {
  transaction_id: string;
};

export type DeferredCredentialResponseDto = {
  credentials: Array<{ credential: string | Record<string, unknown> }>;
  notification_id?: string;
};

export type CredentialResponseDto =
  | {
      credentials: Array<{ credential: string | Record<string, unknown> }>;
      notification_id?: string;
    }
  | {
      transaction_id: string;
      notification_id?: string;
    };

// TODO: fix
export type CredentialConfiguration = {
  format: string;
  scope?: string;
  cryptographic_binding_methods_supported?: string[];
  credential_signing_alg_values_supported?: string[];
  credential_definition?: {
    type: string[];
    '@context'?: string[];
  };
  doctype?: string;
  claims?: Array<{
    path: (string | null | number)[];
    mandatory?: boolean;
    display?: Array<{
      name: string;
      locale?: string;
    }>;
  }>;
};

export type IssuerMetadata = {
  credential_issuer: string;
  authorization_servers?: string[];
  credential_endpoint: string;
  nonce_endpoint?: string;
  deferred_credential_endpoint?: string;
  notification_endpoint?: string;
  credential_response_encryption?: {
    alg_values_supported: string[];
    enc_values_supported: string[];
    encryption_required?: boolean;
  };
  batch_credential_issuance?: {
    batch_size: number;
  };
  signed_metadata?: string;
  display?: Array<{
    name?: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
  }>;
  credential_configurations_supported: {
    [key: string]: any;
  };
};

export const DEFAULT_PATH = {
  CREDENTIAL: 'credential',
  NONCE: 'nonce',
  DEFERRED_CREDENTIAL: 'deferred_credential',
  NOTIFICATION: 'notification',
  CREDENTIAL_OFFER: 'credential-offer',
  TOKEN: 'token',
};

export type CredentialOfferByRef = {
  credential_offer_uri: string;
};

export type CredentialOfferByValue = {
  credential_issuer: string;
  credential_configuration_ids: string[];
  grants?: Grant;
};

export type Grant = AuthGrant | PreAuthGrant;

export type AuthGrant = {
  authorization_code: {
    issuer_state?: string;
    authorization_server?: string;
  };
};

export type PreAuthGrant = {
  'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
    'pre-authorized_code': string;
    tx_code?: {
      input_mode?: 'numeric' | 'text';
      length?: number;
      description?: string;
    };
    authorization_server?: string;
  };
};

export type TokenDto = TokenAuthDto | TokenPreAuthDto;

export type TokenAuthDto = {
  grant_type: 'authorization_code';
  code: string;
  code_verifier?: string;
  redirect_uri: string;
  client_assertion_type?: string;
  client_assertion?: string;
  authorization_details?: string;
};

export type TokenPreAuthDto = {
  grant_type: 'pre-authorized_code';
  pre_authorized_code: string;
  tx_code?: string;
  authorization_details?: string;
};

export type TokenResponseDto = {
  access_token: string;
  token_type: string;
  expires_in: number;
  authorization_details?: {
    type: string;
    credential_configuration_id: string;
    credential_identifier: string[];
  };
};

export type CredentialRequestDto =
  | CredentialRequestIdentifier
  | CredentialRequestByConfigurationId;

export type CredentialRequestIdentifier = {
  credential_identifier: string;
  proof?: Proof;
  proofs: Proof[];
  credential_response_encryption?: {
    jwk: JsonWebKey;
    alg: string;
    enc: string;
  };
};

export type CredentialRequestByConfigurationId = {
  credential_configuration_id: string;
  proof?: Proof;
  proofs: Proof[];
  credential_response_encryption?: {
    jwk: JsonWebKey;
    alg: string;
    enc: string;
  };
};

export type Proof = JwtProof | LdpVpProof | AttestationProof;

export type JwtProof = {
  proof_type: 'jwt';
  jwt: string;
};

export type LdpVpProof = {
  proof_type: 'ldp_vp';
  // TODO: define type
  ldp_vp: Record<string, unknown>;
};

export type AttestationProof = {
  proof_type: 'attestation';
  attestation: string;
};
