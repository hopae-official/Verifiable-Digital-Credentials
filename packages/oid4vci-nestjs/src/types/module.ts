import { Type } from '@nestjs/common';

export class Oid4VciOptions {
  meta: {
    credential_issuer: string;
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
