import { Injectable } from '@nestjs/common';
import { CredentialProvider } from './iservice';

@Injectable()
export class CredentialService implements CredentialProvider {
  async issueCredential(): Promise<void> {
    return; // TODO: implement
  }
}
