import { CredentialBase } from './credentials/credential';
import { SdJwtVcCredential } from './credentials/sdjwtvc.credential';
import { Credential, CredentialSet, rawDCQL } from './type';

/**
 * This class represent DCQL query data structure
 */
export class DCQL {
  public credentials: CredentialBase[] = [];
  public credential_sets?: CredentialSet[];

  constructor({
    credentials,
    credential_sets,
  }: {
    credentials?: CredentialBase[];
    credential_sets?: CredentialSet[];
  }) {
    this.credentials = credentials ?? [];
    this.credential_sets = credential_sets;
  }

  addCredential(credential: CredentialBase) {
    this.credentials.push(credential);
    return this;
  }

  addCredentialSet(credential_set: CredentialSet) {
    if (!this.credential_sets) {
      this.credential_sets = [];
    }
    this.credential_sets.push(credential_set);
    return this;
  }

  serialize(): rawDCQL {
    return {
      credentials: this.credentials.map((c) => c.serialize()),
      credential_sets: this.credential_sets,
    };
  }

  static parse(raw: rawDCQL): DCQL {
    const credentials = raw.credentials.map((c) => {
      if (c.format === 'dc+sd-jwt') {
        return DCQL.parseSdJwtCredential(c);
      }
      throw new Error('Invalid credential format');
    });

    return new DCQL({
      credentials,
      credential_sets: raw.credential_sets,
    });
  }

  static parseSdJwtCredential(c: Credential): CredentialBase {
    if (c.format !== 'dc+sd-jwt') {
      throw new Error('Invalid credential format');
    }

    if (!c.meta || !('vct_value' in c.meta)) {
      throw new Error('Invalid credential meta');
    }

    const sdJwtVcCredential = new SdJwtVcCredential(c.id, c.meta.vct_value);
    sdJwtVcCredential.assign({
      multiple: c.multiple,
      trusted_authorities: c.trusted_authorities,
      require_cryptographic_holder_binding:
        c.require_cryptographic_holder_binding,
      claims: c.claims,
      claim_sets: c.claim_sets,
    });

    return sdJwtVcCredential;
  }

  match(data: Record<string, unknown>) {
    // TODO: implement
    // TODO: define return type
  }
}
