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

export type SendAuthorizationResponseOptions = {
  responseUri: string;
  vpToken: string;
  state?: string;
  responseMode?: 'direct_post' | 'direct_post.jwt';
};
