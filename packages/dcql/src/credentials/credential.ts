import { Credential } from '../type';

/**
 * This class represent a credential
 *
 *
 */
export abstract class CredentialBase {
  abstract serialize(): Credential;

  abstract match(data: Record<string, unknown>): boolean;
}
