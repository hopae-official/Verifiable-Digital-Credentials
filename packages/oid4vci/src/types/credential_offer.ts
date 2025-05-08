export type CredentialOfferType = 'authorization_code' | 'pre-authorized_code';

export type CredentialOfferOptionBase = {
  type: CredentialOfferType;
  credential_configuration_ids?: string[]; // if not provided, use value from the metadata
  authorization_server?: string;
  useRef?: boolean; // default is false
};

/**
 * Transaction code
 *
 * @param input_mode - Input mode (numeric or text) default is numeric
 * @param length - Length of transaction code (if used for creating credential offer then default is 4)
 * @param description - Description of transaction code
 */
export type TxCode = {
  input_mode?: 'numeric' | 'text';
  length?: number;
  description?: string;
};

export type CredentialOfferPreAuthOption = CredentialOfferOptionBase & {
  type: 'pre-authorized_code';
  tx_code?: TxCode;
};

export type CredentialOfferAuthorizationCodeOption =
  CredentialOfferOptionBase & {
    type: 'authorization_code';
    issuer_state?: string;
  };

export type CredentialOfferOption =
  | CredentialOfferPreAuthOption
  | CredentialOfferAuthorizationCodeOption;

export type AuthorizationCodeGrant = {
  authorization_code: {
    issuer_state?: string;
    authorization_server?: string;
  };
};

export type PreAuthorizedCodeGrant = {
  'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
    'pre-authorized_code': string;
    tx_code?: TxCode;
    authorization_server?: string;
  };
};

export type Grant = AuthorizationCodeGrant | PreAuthorizedCodeGrant;

/**
 * Credential offer
 *
 * @param credential_issuer - Credential issuer
 * @param credential_configuration_ids - Credential configuration IDs
 * @param grants - Grants (contains authorization_code or pre-authorized_code)
 */
export type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: string[];
  grants?: Grant;
};

/**
 * Response of credential offer
 *
 * @param raw - Credential Offer Object
 * @param credential_offer - URL encoded credential offer
 * @param credential_offer_uri - URL encoded credential offer URI (when useRef is true)
 * @param credential_offer_uri_key - Key of credential offer URI (when useRef is true)
 * @param pre-authorized_code - Pre-authorized code (when type is pre-authorized_code)
 * @param tx_code - Transaction code (when type is pre-authorized_code)
 */
export type CredentialOfferResponse = {
  raw: CredentialOffer;
  credential_offer: string;
  credential_offer_uri?: string;
  credential_offer_uri_key?: string;
  'pre-authorized_code'?: string;
  tx_code?: string;
};
