import { CredentialBase } from './credentials/credential';
import { CredentialSet, rawDCQL } from './type';

/**
 * This class represent DCQL query data structure
 */
export class DCQL {
  private _credentials: CredentialBase[] = [];
  private _credential_sets?: CredentialSet[];

  constructor() {}

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
    // TODO: implement
    return new DCQL();
  }

  match(data: Record<string, unknown>) {
    // TODO: implement
    // TODO: define return type
  }
}
