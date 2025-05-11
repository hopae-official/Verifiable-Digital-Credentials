import { Type } from '@nestjs/common';

export class Oid4VpOptions {
  credential_verifier: string;
}

export interface Oid4VpOptionsFactory {
  createOid4VpOptions(): Promise<Oid4VpOptions> | Oid4VpOptions;
}

export type Oid4VpModuleAsyncOptions = {
  imports?: any[];
  useExisting?: Type<Oid4VpOptionsFactory>;
  useClass?: Type<Oid4VpOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<Oid4VpOptions> | Oid4VpOptions;
  inject?: any[];
};
