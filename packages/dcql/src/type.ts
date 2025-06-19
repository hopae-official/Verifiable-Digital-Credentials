export type Format = 'dc+sd-jwt' | 'ldp_vc' | 'jwt_vc_json';

export type TrustedAuthority = {
  type: 'aki' | 'etsi_tl' | 'openid_federation';
  value: string[];
};

export type Credential = {
  id: string;
  format: Format;

  /** optional, default is false */
  multiple?: boolean;
  meta?: { vct_values: string[] } | { doctype_value: string };
  trusted_authorities?: TrustedAuthority[];

  /** optional, default is true */
  require_cryptographic_holder_binding?: boolean;

  claims?: Claims[];
  claim_sets?: ClaimSet[];
};

export type CredentialIds = Array<string>;

export type CredentialSet = {
  options: CredentialIds[];
  purpose?: string;

  /** optional, default is true */
  required?: boolean;
};

export type rawDCQL = {
  credentials: Credential[];
  credential_sets?: CredentialSet[];
};

export type Claims = {
  /** optional, but if claim_sets is present, it is required */
  id?: string;

  path: Array<string | number | null>;

  value?: Array<number | string | boolean>;
};

export type ClaimSet = string[];

export type SdJwtVcCredentialQuery = Credential & {
  format: 'dc+sd-jwt';
  meta: {
    vct_values: string[];
  };
};

export type MatchResult =
  | {
      match: false;
      matchedClaims?: undefined;
      matchedIndices?: undefined;
    }
  | {
      match: true;
      matchedClaims: Claims[];
      matchedIndices: number[];
    };
