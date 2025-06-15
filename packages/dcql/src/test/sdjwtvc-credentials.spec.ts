import { describe, expect, it } from 'vitest';
import { SdJwtVcCredential } from '../credentials/sdjwtvc.credential';
import { Claims, ClaimSet, TrustedAuthority } from '../type';

describe('Credentials', () => {
  describe('SdJwtVcCredential', () => {
    it('should create an instance with required properties', () => {
      const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);

      expect(credential).toBeDefined();
      expect(credential.id).toBe('test-id');
      expect(credential.vct_values).toEqual(['test-vct-value']);
    });

    describe('setMultiple', () => {
      it('should set multiple flag', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);

        const result = credential.setMultiple(true);

        // Should return this for chaining
        expect(result).toBe(credential);

        // Verify it was set by checking serialized output
        const serialized = credential.serialize();
        expect(serialized.multiple).toBe(true);
      });
    });

    describe('setTrustedAuthorities', () => {
      it('should set trusted authorities', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        const authorities: TrustedAuthority[] = [
          { type: 'aki', value: ['test-value'] },
        ];

        const result = credential.setTrustedAuthorities(authorities);

        // Should return this for chaining
        expect(result).toBe(credential);

        // Verify it was set by checking serialized output
        const serialized = credential.serialize();
        expect(serialized.trusted_authorities).toEqual(authorities);
      });
    });

    describe('setRequireCryptographicHolderBinding', () => {
      it('should set cryptographic holder binding requirement', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);

        const result = credential.setRequireCryptographicHolderBinding(false);

        // Should return this for chaining
        expect(result).toBe(credential);

        // Verify it was set by checking serialized output
        const serialized = credential.serialize();
        expect(serialized.require_cryptographic_holder_binding).toBe(false);
      });
    });

    describe('setClaims', () => {
      it('should set claims', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        const claims: Claims[] = [
          { path: ['$.vc.credentialSubject.firstName'], value: ['John'] },
          { path: ['$.vc.credentialSubject.lastName'], value: ['Doe'] },
        ];

        const result = credential.setClaims(claims);

        // Should return this for chaining
        expect(result).toBe(credential);

        // Verify it was set by checking serialized output
        const serialized = credential.serialize();
        expect(serialized.claims).toEqual(claims);
      });
    });

    describe('setClaimSets', () => {
      it('should set claim sets when claims are properly set', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        const claims: Claims[] = [
          {
            id: 'claim1',
            path: ['$.vc.credentialSubject.firstName'],
            value: ['John'],
          },
          {
            id: 'claim2',
            path: ['$.vc.credentialSubject.lastName'],
            value: ['Doe'],
          },
        ];

        credential.setClaims(claims);

        const claimSets: ClaimSet[] = [['claim1', 'claim2']];

        const result = credential.setClaimSets(claimSets);

        // Should return this for chaining
        expect(result).toBe(credential);

        // Verify it was set by checking serialized output
        const serialized = credential.serialize();
        expect(serialized.claim_sets).toEqual(claimSets);
      });

      it('should throw error if claims are not set', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        const claimSets: ClaimSet[] = [['claim1']];

        expect(() => credential.setClaimSets(claimSets)).toThrow(
          'Claims must be set before claim sets',
        );
      });

      it('should throw error if claims do not have IDs', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        // Claims without IDs
        const claims: Claims[] = [
          { path: ['$.vc.credentialSubject.firstName'], value: ['John'] },
        ];

        credential.setClaims(claims);

        const claimSets: ClaimSet[] = [['claim1']];

        expect(() => credential.setClaimSets(claimSets)).toThrow(
          'Claims must not have an id before claim sets',
        );
      });
    });

    describe('serialize', () => {
      it('should serialize credential with all properties', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);
        const authorities: TrustedAuthority[] = [
          { type: 'aki', value: ['test-value'] },
        ];
        const claims: Claims[] = [
          {
            id: 'claim1',
            path: ['$.vc.credentialSubject.firstName'],
            value: ['John'],
          },
        ];
        const claimSets: ClaimSet[] = [['claim1']];

        credential
          .setMultiple(true)
          .setTrustedAuthorities(authorities)
          .setRequireCryptographicHolderBinding(false)
          .setClaims(claims)
          .setClaimSets(claimSets);

        const serialized = credential.serialize();

        expect(serialized).toEqual({
          id: 'test-id',
          format: 'dc+sd-jwt',
          meta: { vct_values: ['test-vct-value'] },
          multiple: true,
          trusted_authorities: authorities,
          require_cryptographic_holder_binding: false,
          claims: claims,
          claim_sets: claimSets,
        });
      });

      it('should serialize credential with minimal properties', () => {
        const credential = new SdJwtVcCredential('test-id', ['test-vct-value']);

        const serialized = credential.serialize();

        expect(serialized).toEqual({
          id: 'test-id',
          format: 'dc+sd-jwt',
          meta: { vct_values: ['test-vct-value'] },
          multiple: undefined,
          trusted_authorities: undefined,
          require_cryptographic_holder_binding: undefined,
          claims: undefined,
          claim_sets: undefined,
        });
      });
    });

    describe('Match claim functionality', () => {
      // Access the private matchClaim method for testing

      it('should match a simple claim', () => {
        const claim = { path: ['name'] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', name: 'John' };
        expect(credential.match(data)).toStrictEqual({
          match: true,
          matchedClaims: [{ path: ['name'] }],
        });
      });

      it('should match a claim with value restriction', () => {
        const claim = { path: ['age'], value: [30, 40] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', age: 30 };
        expect(credential.match(data)).toStrictEqual({
          match: true,
          matchedClaims: [{ path: ['age'], value: [30, 40] }],
        });
      });

      it("should not match when value doesn't match restriction", () => {
        const claim = { path: ['age'], value: [40, 50] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', age: 30 };
        expect(credential.match(data)).toStrictEqual({ match: false });
      });

      it('should handle errors in path processing gracefully', () => {
        const claim = { path: ['items', null] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', items: 'not-an-array' };
        expect(credential.match(data)).toStrictEqual({ match: false });
      });

      it('should match array elements with null in path', () => {
        const claim = { path: ['items', null], value: [3] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', items: [1, 2, 3, 4] };
        expect(credential.match(data)).toStrictEqual({
          match: true,
          matchedClaims: [{ path: ['items', null], value: [3] }],
        });
      });

      it("should return false when claim path doesn't exist", () => {
        const claim = { path: ['nonexistent'] };
        const credential = new SdJwtVcCredential(
          'test-id',
          ['test-vct-value'],
          {
            claims: [claim],
          },
        );
        const data = { vct: 'test-vct-value', name: 'John' };
        expect(credential.match(data)).toStrictEqual({ match: false });
      });
    });
  });
});
