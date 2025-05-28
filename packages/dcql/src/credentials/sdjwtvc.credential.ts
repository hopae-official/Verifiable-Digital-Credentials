import { pathMatch } from '../match';
import {
  Claims,
  ClaimSet,
  Credential,
  MatchResult,
  SdJwtVcCredentialQuery,
  TrustedAuthority,
} from '../type';
import { CredentialBase } from './credential';

export class SdJwtVcCredential implements CredentialBase {
  private _multiple?: boolean;
  private _trusted_authorities?: TrustedAuthority[];
  private _require_cryptographic_holder_binding?: boolean;
  private _claims?: Claims[];
  private _claim_sets?: ClaimSet[];

  constructor(
    public readonly id: string,
    public readonly vct_value: string,
    options?: {
      multiple?: boolean;
      trusted_authorities?: TrustedAuthority[];
      require_cryptographic_holder_binding?: boolean;
      claims?: Claims[];
      claim_sets?: ClaimSet[];
    },
  ) {
    if (options) {
      this._multiple = options.multiple;
      this._trusted_authorities = options.trusted_authorities;
      this._require_cryptographic_holder_binding =
        options.require_cryptographic_holder_binding;
      this._claims = options.claims;
      this._claim_sets = options.claim_sets;
    }
  }

  setMultiple(multiple: boolean) {
    this._multiple = multiple;
    return this;
  }

  setTrustedAuthorities(trusted_authorities: TrustedAuthority[]) {
    this._trusted_authorities = trusted_authorities;
    return this;
  }

  setRequireCryptographicHolderBinding(
    require_cryptographic_holder_binding: boolean,
  ) {
    this._require_cryptographic_holder_binding =
      require_cryptographic_holder_binding;
    return this;
  }

  setClaims(claims: Claims[]) {
    this._claims = claims;
    return this;
  }

  setClaimSets(claim_sets: ClaimSet[]) {
    /**
     * Check if claims are set properly
     */
    if (!this._claims || this._claims.length === 0) {
      throw new Error('Claims must be set before claim sets');
    }

    if (!this._claims.every((c) => c.id !== undefined)) {
      throw new Error('Claims must not have an id before claim sets');
    }

    this._claim_sets = claim_sets;
    return this;
  }

  serialize(): Credential {
    return {
      id: this.id,
      format: 'dc+sd-jwt',
      meta: { vct_value: this.vct_value },
      multiple: this._multiple,
      trusted_authorities: this._trusted_authorities,
      require_cryptographic_holder_binding:
        this._require_cryptographic_holder_binding,
      claims: this._claims,
      claim_sets: this._claim_sets,
    };
  }

  match(data: Record<string, unknown>): MatchResult {
    // First check if the credential type matches
    if (data['vct'] !== undefined && data['vct'] !== this.vct_value) {
      return { match: false };
    }

    // If claims is absent, the Verifier is requesting no claims that are selectively disclosable
    // Return only the mandatory claims
    if (!this._claims || this._claims.length === 0) {
      return { match: true, matchedClaims: [] };
    }

    // If claim_sets is present, the Verifier requests one combination of the claims listed in claim_sets
    if (this._claim_sets && this._claim_sets.length > 0) {
      // The order of options in claim_sets expresses the Verifier's preference
      // Try to match the first option that can be satisfied
      for (const claimSet of this._claim_sets) {
        const claimsInSet = this._claims.filter(
          (claim) => claim.id !== undefined && claimSet.includes(claim.id),
        );

        // Check if all claims in this set can be satisfied by the data
        const allClaimsMatch = claimsInSet.every((claim) =>
          this.matchClaim(claim, data),
        );

        // If all claims in this set can be satisfied, return the earliest set
        if (allClaimsMatch && claimsInSet.length > 0) {
          return {
            match: true,
            matchedClaims: claimsInSet,
          };
        }
      }

      // If we can't satisfy any of the claim sets, don't return any claims
      return { match: false };
    }
    // If claims is present but claim_sets is absent, the Verifier requests all claims listed in claims
    else {
      const satisfiableClaims = this._claims.every((claim) =>
        this.matchClaim(claim, data),
      );

      // Only match if we can satisfy all claims
      if (satisfiableClaims) {
        return { match: true, matchedClaims: this._claims };
      }
    }

    return { match: false };
  }

  /**
   * Helper method to check if a specific claim matches against the data
   * Implements semantics for JSON-based credentials as specified in section 7.1
   */
  private matchClaim(claim: Claims, data: Record<string, unknown>): boolean {
    try {
      // Start with the root element (top-level JSON object)
      const selectedElements = pathMatch(claim.path, data);

      // If no elements were selected, the claim can't be matched
      if (selectedElements.length === 0) {
        return false;
      }

      // If the claim doesn't have a value restriction, any selected value is acceptable
      if (!claim.value || claim.value.length === 0) {
        return true;
      }

      // Check if any of the selected elements match any of the allowed values
      return selectedElements.some((element) =>
        claim.value!.some((val) => val === element),
      );
    } catch (error) {
      // If there was an error processing the path, the claim can't be matched
      return false;
    }
  }

  static parseSdJwtCredential(c: Credential): CredentialBase {
    if (!this.validateCredential(c)) {
      throw new Error('Invalid credential');
    }

    const sdJwtVcCredential = new SdJwtVcCredential(c.id, c.meta.vct_value, {
      multiple: c.multiple,
      trusted_authorities: c.trusted_authorities,
      require_cryptographic_holder_binding:
        c.require_cryptographic_holder_binding,
      claims: c.claims,
      claim_sets: c.claim_sets,
    });

    return sdJwtVcCredential;
  }

  private static validateCredential(
    c: Credential,
  ): c is SdJwtVcCredentialQuery {
    if (c.format !== 'dc+sd-jwt') {
      throw new Error('Invalid credential format');
    }

    if (!c.meta || !('vct_value' in c.meta)) {
      throw new Error('Invalid credential meta');
    }

    return true;
  }
}
