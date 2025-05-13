import { describe, expect, it } from 'vitest';
import { DCQL } from '../dcql';
import { SdJwtVcCredential } from '../credentials/sdjwtvc.credential';
import { Claims, CredentialSet } from '../type';

describe('DCQL', () => {
  it('should create an instance', () => {
    const dcql = new DCQL();
    expect(dcql).toBeDefined();
  });

  describe('addCredential', () => {
    it('should add a credential', () => {
      const dcql = new DCQL();
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
      const dcql = new DCQL();
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
      const dcql = new DCQL();
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
      const dcql = new DCQL();
      const credentialSet: CredentialSet = {
        options: [['test-id-1']],
      };

      dcql.addCredentialSet(credentialSet);

      const serialized = dcql.serialize();
      expect(serialized.credential_sets).toBeDefined();
      expect(serialized.credential_sets).toHaveLength(1);
    });
  });

  describe('serialize', () => {
    it('should serialize empty DCQL', () => {
      const dcql = new DCQL();
      const serialized = dcql.serialize();

      expect(serialized).toEqual({
        credentials: [],
        credential_sets: undefined,
      });
    });

    it('should serialize DCQL with credentials and credential sets', () => {
      const dcql = new DCQL();
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
