import { CredentialBase } from './credentials/credential';
import { SdJwtVcCredential } from './credentials/sdjwtvc.credential';
import { Claims, CredentialSet, rawDCQL } from './type';

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

  /**
   * Match credentials against an array of data records according to section 6.4.2 rules.
   *
   * If credential_sets is not provided, all credentials in credentials are requested.
   * Otherwise, the Verifier requests credentials satisfying:
   * - All required credential sets (where required is true or omitted)
   * - Optionally, any other credential sets
   *
   * @param dataRecords Array of data records to match against
   * @returns Object containing match result and matched credentials with their claims
   */
  match(dataRecords: Record<string, unknown>[]): {
    match: boolean;
    matchedCredentials?: Array<{
      credential: Record<string, unknown>;
      matchedClaims: Claims[];
      dataIndex: number;
      credentialQueryId: string;
    }>;
  } {
    // No credentials to match
    if (this._credentials.length === 0) {
      return { match: false };
    }

    // Results array to collect all matches
    const allMatches: Array<{
      credential: Record<string, unknown>;
      dcqlCredential: CredentialBase;
      matchedClaims: Claims[];
      dataIndex: number;
    }> = [];

    // Check each credential against the data records
    this._credentials.forEach((credential) => {
      const result = credential.match(dataRecords);
      if (result.match && result.matchedClaims && result.matchedIndices) {
        // For multiple=false case, we only get one match from the first matching record
        // For multiple=true case, we get matches from multiple records that contributed to the match
        result.matchedIndices.forEach((index) => {
          allMatches.push({
            credential: dataRecords[index],
            dcqlCredential: credential,
            matchedClaims: result.matchedClaims,
            dataIndex: index,
          });
        });
      }
    });

    // If no credentials matched any data, return no match
    if (allMatches.length === 0) {
      return { match: false };
    }

    // Credential IDs matched in dataRecords
    const matchedIds = new Set(
      allMatches.map((match) => {
        const serialized = match.dcqlCredential.serialize();
        return serialized.id;
      }),
    );

    // If credential_sets is not defined
    if (!this._credential_sets || this._credential_sets.length === 0) {
      // All IDs in Credential Query
      const allCredentialIds = this._credentials.map((c) => c.serialize().id);

      const everyCredentialSatisfied = allCredentialIds.every((id) =>
        matchedIds.has(id),
      );
      // If any credential is missing in allMatches, we can't match
      if (!everyCredentialSatisfied) {
        return { match: false };
      }
      // If all credentials are matched, we can match and return all matched credentials
      return {
        match: true,
        matchedCredentials: allMatches.map((match) => ({
          credential: match.credential,
          matchedClaims: match.matchedClaims,
          dataIndex: match.dataIndex,
          credentialQueryId: match.dcqlCredential.serialize().id,
        })),
      };
    }

    // First, separate required credential sets
    const requiredSets = this._credential_sets.filter(
      (set) => set.required === undefined || set.required === true,
    );

    // Check if all required sets are satisfied
    const satisfiedRequiredSets = requiredSets.every((set) =>
      this.isCredentialSetSatisfied(set, matchedIds),
    );

    // If any required set is not satisfied, we can't match
    if (!satisfiedRequiredSets) {
      return { match: false };
    }

    // We've satisfied all required sets, return all matched credentials
    return {
      match: true,
      matchedCredentials: allMatches.map((matches) => {
        return {
          credential: matches.credential,
          matchedClaims: matches.matchedClaims,
          dataIndex: matches.dataIndex,
          credentialQueryId: matches.dcqlCredential.serialize().id,
        };
      }),
    };
  }

  /**
   * Check if a credential set is satisfied by the matched credential IDs
   * A credential set is satisfied if at least one of its options is satisfied
   */
  private isCredentialSetSatisfied(
    set: CredentialSet,
    matchedIds: Set<string>,
  ): boolean {
    // A set is satisfied if at least one of its options is satisfied
    return set.options.some((option) => {
      // An option is satisfied if all credential IDs in the option are matched
      return option.every((credentialId) => matchedIds.has(credentialId));
    });
  }
}
