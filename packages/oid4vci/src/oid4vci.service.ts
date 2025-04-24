import { Injectable } from '@nestjs/common';
import { Oid4VciOptions } from './type';
import { CredentialProvider } from './iservice';

@Injectable()
export class Oid4VciService {
  constructor(
    private readonly options: Oid4VciOptions,
    private readonly credentialProvider: CredentialProvider,
  ) {}
}
