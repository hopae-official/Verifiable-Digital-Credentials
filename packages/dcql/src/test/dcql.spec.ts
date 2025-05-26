import { describe, expect, it } from 'vitest';
import { DCQL } from '../dcql';
import { SdJwtVcCredential } from '../credentials/sdjwtvc.credential';
import { Claims, CredentialSet, rawDCQL } from '../type';

describe('DCQL', () => {
  it('should create an instance', () => {
    const dcql = new DCQL({});
    expect(dcql).toBeDefined();
  });

  describe('addCredential', () => {
    it('should add a credential', () => {
      const dcql = new DCQL({});
      const credential = new SdJwtVcCredential('test-id', 'test-vct');

      const result = dcql.addCredential(credential);

      // Should return this for chaining
      expect(result).toBe(dcql);

      // Verify it was added by checking serialized output
      const serialized = dcql.serialize();
      expect(serialized.credentials).toHaveLength(1);
      expect(serialized.credentials[0].id).toBe('test-id');
    });

    it('should add multiple credentials', () => {
      const dcql = new DCQL({});
      const credential1 = new SdJwtVcCredential('test-id-1', 'test-vct-1');
      const credential2 = new SdJwtVcCredential('test-id-2', 'test-vct-2');

      dcql.addCredential(credential1).addCredential(credential2);

      const serialized = dcql.serialize();
      expect(serialized.credentials).toHaveLength(2);
      expect(serialized.credentials[0].id).toBe('test-id-1');
      expect(serialized.credentials[1].id).toBe('test-id-2');
    });
  });

  describe('addCredentialSet', () => {
    it('should add a credential set', () => {
      const dcql = new DCQL({});
      const credentialSet: CredentialSet = {
        options: [['test-id-1'], ['test-id-2']],
        required: true,
      };

      const result = dcql.addCredentialSet(credentialSet);

      // Should return this for chaining
      expect(result).toBe(dcql);

      // Verify it was added by checking serialized output
      const serialized = dcql.serialize();
      expect(serialized.credential_sets).toHaveLength(1);
      expect(serialized.credential_sets?.[0].options).toHaveLength(2);
      expect(serialized.credential_sets?.[0].required).toBe(true);
    });

    it('should initialize credential_sets array if undefined', () => {
      const dcql = new DCQL({});
      const credentialSet: CredentialSet = {
        options: [['test-id-1']],
      };

      dcql.addCredentialSet(credentialSet);

      const serialized = dcql.serialize();
      expect(serialized.credential_sets).toBeDefined();
      expect(serialized.credential_sets).toHaveLength(1);
    });
  });

  describe('parse', () => {
    it('should parse valid raw DCQL with sd-jwt-vc credential', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'test-id',
            format: 'dc+sd-jwt',
            meta: { vct_value: 'test-vct' },
            multiple: true,
            trusted_authorities: [{ type: 'aki', value: ['test-authority'] }],
            require_cryptographic_holder_binding: true,
            claims: [{ path: ['$.vc.credentialSubject.firstName'] }],
          },
        ],
      };

      const dcql = DCQL.parse(rawDcql);
      const serialized = dcql.serialize();

      expect(serialized.credentials).toHaveLength(1);
      expect(serialized.credentials[0]).toEqual(rawDcql.credentials[0]);
    });

    it('should parse DCQL with credential sets', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'cred-1',
            format: 'dc+sd-jwt',
            meta: { vct_value: 'vct-1' },
          },
          {
            id: 'cred-2',
            format: 'dc+sd-jwt',
            meta: { vct_value: 'vct-2' },
          },
        ],
        credential_sets: [
          {
            options: [['cred-1'], ['cred-2']],
            required: true,
          },
        ],
      };

      const dcql = DCQL.parse(rawDcql);
      const serialized = dcql.serialize();

      expect(serialized.credentials).toHaveLength(2);
      expect(serialized.credential_sets).toHaveLength(1);
      expect(serialized.credential_sets![0].options).toEqual([
        ['cred-1'],
        ['cred-2'],
      ]);
    });
  });

  describe('serialize', () => {
    it('should serialize empty DCQL', () => {
      const dcql = new DCQL({});
      const serialized = dcql.serialize();

      expect(serialized).toEqual({
        credentials: [],
        credential_sets: undefined,
      });
    });

    it('should serialize DCQL with credentials and credential sets', () => {
      const dcql = new DCQL({});
      const credential = new SdJwtVcCredential('test-id', 'test-vct');
      const credentialSet: CredentialSet = {
        options: [['test-id']],
        required: false,
      };

      dcql.addCredential(credential).addCredentialSet(credentialSet);

      const serialized = dcql.serialize();
      expect(serialized).toEqual({
        credentials: [credential.serialize()],
        credential_sets: [credentialSet],
      });
    });
  });
});
