import { Claims, ClaimSet, Credential, TrustedAuthority } from '../type';
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
  ) {}

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

  match(data: Record<string, unknown>): boolean {
    return false;
  }
}
