export type CredentialOfferType = 'authorization_code' | 'pre-authorized_code';

export type CredentialOfferOptionBase = {
  type: CredentialOfferType;
  credential_configuration_ids?: string[]; // if not provided, use value from the metadata
  authorization_server?: string;
  useRef?: boolean; // default is false
};

export type TxCode = {
  input_mode?: 'numeric' | 'text'; // default is numberic
  length?: number;
  description?: string;
};

export type CredentialOfferPreAuthOption = CredentialOfferOptionBase & {
  type: 'pre-authorized_code';
  tx_code?: TxCode; // default is 4
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
    pre_authorized_code: string;
    tx_code?: TxCode;
    authorization_server?: string;
  };
};

export type Grant = AuthorizationCodeGrant | PreAuthorizedCodeGrant;

export type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: string[];
  grants: Grant;
};

// TODO: fix
/**
 * Response of credential offer
 *
 * @example
 * ```ts
 *
 * ```
 *
 * @param credential_offer - Credential offer
 * @param credential_offer_uri - Credential offer URI
 * @param pre_authorized_code - Pre-authorized code
 * @param tx_code - Transaction code
 */
export type CredentialOfferResponse = {
  raw: CredentialOffer;
  credential_offer: string;
  // if useRef is true, credential_offer_uri is returned
  credential_offer_uri?: string;
  credential_offer_uri_key?: string;

  // if pre-authorized_code is used
  pre_authorized_code?: string;
  // if tx_code is used
  tx_code?: string;
};
