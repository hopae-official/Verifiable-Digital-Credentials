export type AttackPotentialResistance =
  | 'iso_18045_high'
  | 'iso_18045_moderate'
  | 'iso_18045_enhanced-basic'
  | 'iso_18045_basic';

export type ProofType = 'jwt' | 'ldp_vp' | 'attestation';

export type Format =
  | 'jwt_vc_json'
  | 'jwt_vc_json-ld'
  | 'ldp_vc'
  | 'mso_mdoc'
  | 'dc+sd-jwt';

export type Claim = {
  path: string[];
  mandatory?: boolean;
  display?: {
    name?: string;
    locale?: string;
  };
};

export type CredentialConfigurationSupported = {
  format: Format | string;
  scope?: string;
  cryptographic_binding_methods_supported?: Array<string>;
  credential_signing_alg_values_supported?: Array<string>;
  proof_types_supported?: {
    [proofType: string]: {
      proof_signing_alg_values_supported: string;
      key_attestations_required?: {
        key_storage?: Array<AttackPotentialResistance>;
        user_authentication?: Array<AttackPotentialResistance>;
      };
    };
  };
  display?: Array<{
    name: string;
    locale?: string;
    logo?: {
      uri: string;
      alt_text?: string;
    };
    description?: string;
    background_color?: string;
    background_image?: {
      uri: string;
    };
    text_color?: string;
  }>;
} & (
  | JwtVcJsonMetadata
  | LdpVcMetadata
  | JwtVcJsonLdMetadata
  | MsoMdocMetadata
  | DcSdJwtMetadata
);

export type JwtVcJsonMetadata = {
  claims?: Array<Claim>;
  credential_definition: {
    type: string[];
  };
};

export type LdpVcMetadata = {
  claims?: Array<Claim>;
  credential_definition: {
    '@context': string[];
    type: string[];
  };
};

export type JwtVcJsonLdMetadata = {
  claims?: Array<Claim>;
  credential_definition: {
    '@context': string[];
    type: string[];
  };
};

export type MsoMdocMetadata = {
  claims?: Array<Claim>;
  doctype: string;
};

export type DcSdJwtMetadata = {
  claims?: Array<Claim>;
  vct: string;
};
