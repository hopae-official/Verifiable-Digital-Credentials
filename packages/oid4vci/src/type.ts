import { Type } from '@nestjs/common';
import { CredentialProvider } from './iservice';

export type Oid4VciModuleOptions = {
  credentialProvider?: Type<CredentialProvider>;
  options: Oid4VciOptions;
};

export type Oid4VciModuleAsyncOptions = {
  imports?: any[];
  useExisting?: Type<Oid4VciOptionsFactory>;
  useClass?: Type<Oid4VciOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<Oid4VciModuleOptions> | Oid4VciModuleOptions;
  inject?: any[];
};

export type Oid4VciOptionsFactory = {
  createOid4VciOptions(): Promise<Oid4VciModuleOptions> | Oid4VciModuleOptions;
};

export class Oid4VciOptions {
  credential_issuer: string;
}
