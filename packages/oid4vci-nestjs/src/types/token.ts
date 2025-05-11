import {
  JwtVcJsonLdMetadata,
  LdpVcMetadata,
  MsoMdocMetadata,
  DcSdJwtMetadata,
} from './credential_configurations_supported';

export type AuthorizationDetail =
  | {
      type: 'openid_credential';
      credential_configuration_id: string;
    }
  | ({
      type: 'openid_credential';
      format: 'jwt_vc_json';
    } & JwtVcJsonLdMetadata)
  | ({
      type: 'openid_credential';
      format: 'ldp_vc';
    } & LdpVcMetadata)
  | ({
      type: 'openid_credential';
      format: 'mso_mdoc';
    } & MsoMdocMetadata)
  | ({
      type: 'openid_credential';
      format: 'dc+sd-jwt';
    } & DcSdJwtMetadata);

export type TokenAuthorizationDetail = Array<
  AuthorizationDetail & {
    credential_identifiers: string[];
    locations?: string[];
  }
>;

export type ValidatePreAuthorizedCodeResponseDto = {
  sub: string;
  authorization_details: TokenAuthorizationDetail;
};

export type TokenResponseDto = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  authorization_details: TokenAuthorizationDetail;
};
