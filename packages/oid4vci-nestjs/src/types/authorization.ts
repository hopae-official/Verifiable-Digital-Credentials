export type AuthorizationDetails = {
  type: string;
  format?: string;
  types?: string[];
  locations?: string[];
  [key: string]: unknown;
};

export type AuthorizationCode = {
  code: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  nonce?: string;
  authorizationDetails?: AuthorizationDetails[];
  expiresAt: Date;
};
