import { Type } from '@nestjs/common';
import { CredentialProvider } from '../iservice';
import { Algorithm, SignOptions } from 'jsonwebtoken';
import { JsonWebKey } from 'node:crypto';
import { CredentialConfigurationSupported } from './credential_configurations_supported';
import { AuthorizationServerMetadata } from '@vdcs/oid4vci';

export class Oid4VciOptions {
  meta: {
    credential_issuer: string;
    credential_configurations_supported: {
      [credentialConfigurationId: string]: CredentialConfigurationSupported;
    };
    display?: Array<{
      name: string;
      locale: string;
      logo?: {
        uri: string;
        alt_text?: string;
      };
    }>;
    authorization_server?: Partial<AuthorizationServerMetadata>;
  };
  credential_provider?: Type<CredentialProvider>;
  nonce?: {
    secret: string;
    expiresIn?: SignOptions['expiresIn'];
  };
  jwks: {
    keys: Array<JsonWebKey>;
    algorithm: Algorithm;
  };
}

export type Oid4VciModuleAsyncOptions = {
  imports?: any[];
  useExisting?: Type<Oid4VciOptionsFactory>;
  useClass?: Type<Oid4VciOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<Oid4VciOptions> | Oid4VciOptions;
  inject?: any[];
};

export type Oid4VciOptionsFactory = {
  createOid4VciOptions(): Promise<Oid4VciOptions> | Oid4VciOptions;
};
