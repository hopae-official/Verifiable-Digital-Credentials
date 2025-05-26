import {
  Claims,
  ClaimSet,
  Credential,
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

  match(data: Record<string, unknown>): boolean {
    return false;
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
