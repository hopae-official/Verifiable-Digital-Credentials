import { Type } from '@nestjs/common';
import { CredentialProvider } from '../iservice';
import { SignOptions } from 'jsonwebtoken';

export class Oid4VciOptions {
  meta: {
    credential_issuer: string;
  };
  credential_provider?: Type<CredentialProvider>;
  nonce?: {
    secret: string;
    expiresIn?: SignOptions['expiresIn'];
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
