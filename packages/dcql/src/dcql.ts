import { CredentialBase } from './credentials/credential';
import { SdJwtVcCredential } from './credentials/sdjwtvc.credential';
import { CredentialSet, rawDCQL } from './type';

/**
 * This class represent DCQL query data structure
 */
export class DCQL {
  private _credentials: CredentialBase[] = [];
  private _credential_sets?: CredentialSet[];

  constructor({
    credentials,
    credential_sets,
  }: {
    credentials?: CredentialBase[];
    credential_sets?: CredentialSet[];
  }) {
    this._credentials = credentials ?? [];
    this._credential_sets = credential_sets;
  }

  addCredential(credential: CredentialBase) {
    this._credentials.push(credential);
    return this;
  }

  addCredentialSet(credential_set: CredentialSet) {
    if (!this._credential_sets) {
      this._credential_sets = [];
    }
    this._credential_sets.push(credential_set);
    return this;
  }

  serialize(): rawDCQL {
    return {
      credentials: this._credentials.map((c) => c.serialize()),
      credential_sets: this._credential_sets,
    };
  }

  static parse(raw: rawDCQL): DCQL {
    const credentials = raw.credentials.map((c) => {
      if (c.format === 'dc+sd-jwt') {
        return SdJwtVcCredential.parseSdJwtCredential(c);
      }
      throw new Error('Invalid credential format');
    });

    return new DCQL({
      credentials,
      credential_sets: raw.credential_sets,
    });
  }

  match(data: Record<string, unknown>) {
    // TODO: implement
    // TODO: define return type
  }
}
