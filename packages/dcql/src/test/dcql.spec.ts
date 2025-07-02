import { describe, expect, it } from 'vitest';
import { DCQL } from '../dcql';
import { SdJwtVcCredential } from '../credentials/sdjwtvc.credential';
import { CredentialSet, rawDCQL } from '../type';

describe('DCQL', () => {
  it('should create an instance', () => {
    const dcql = new DCQL({});
    expect(dcql).toBeDefined();
  });

  describe('addCredential', () => {
    it('should add a credential', () => {
      const dcql = new DCQL({});
      const credential = new SdJwtVcCredential('test-id', ['test-vct']);

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
      const credential1 = new SdJwtVcCredential('test-id-1', ['test-vct-1']);
      const credential2 = new SdJwtVcCredential('test-id-2', ['test-vct-2']);

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
            meta: { vct_values: ['test-vct'] },
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
            id: '0',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: [
                'eu.europa.ec.eudi.pid.1',
                'urn:eu.europa.ec.eudi:pid:1',
              ],
            },
            claims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
          },
        ],
        credential_sets: [
          {
            options: [['0']],
            purpose: 'PID (sd-jwt-vc) - first_name and given_name',
          },
        ],
      };

      const dcql = DCQL.parse(rawDcql);
      const serialized = dcql.serialize();

      expect(serialized.credentials).toHaveLength(1);
      expect(serialized.credential_sets).toHaveLength(1);
      expect(serialized.credential_sets![0].options).toEqual([['0']]);
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
      const credential = new SdJwtVcCredential('test-id', ['test-vct']);
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

  describe('match', () => {
    it('empty data', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'cred-1',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-1'] },
          },
          {
            id: 'cred-2',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-2'] },
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
      const result = dcql.match([]);
      expect(result).toEqual({ match: false });
    });

    it('test 1', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'cred-1',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-1'] },
          },
          {
            id: 'cred-2',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-2'] },
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
      const result = dcql.match([{ vct: 'vct-1', name: 'name-1' }]);
      expect(result).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: { vct: 'vct-1', name: 'name-1' },
            matchedClaims: [],
            dataIndex: 0,
            credentialQueryId: 'cred-1',
          },
        ],
      });
    });

    it('test 2', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'cred-1',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-1'] },
          },
          {
            id: 'cred-2',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-2'] },
          },
        ],
      };
      const dcql = DCQL.parse(rawDcql);
      const result = dcql.match([{ vct: 'vct-1', name: 'name-1' }]);
      expect(result).toEqual({
        match: false,
      });
    });

    it('test 3 - single credential with claim set', () => {
      const rawDcql: rawDCQL = {
        credentials: [
          {
            id: 'cred-1',
            format: 'dc+sd-jwt',
            meta: { vct_values: ['vct-1'] },
            claims: [
              {
                path: ['first_name'],
                id: 'first_name',
              },
              {
                path: ['last_name'],
                id: 'last_name',
              },
              {
                path: ['name'],
                id: 'name',
              },
            ],
            claim_sets: [['first_name', 'last_name'], ['name']],
          },
        ],
      };
      const dcql = DCQL.parse(rawDcql);
      const result = dcql.match([{ vct: 'vct-1', name: 'name-1' }]);
      expect(result).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: { vct: 'vct-1', name: 'name-1' },
            matchedClaims: [
              {
                path: ['name'],
                id: 'name',
              },
            ],
            dataIndex: 0,
            credentialQueryId: 'cred-1',
          },
        ],
      });
    });

    it('test 4 - single credential without credential set', () => {
      const exampleDCQL: rawDCQL = {
        credentials: [
          {
            id: '0',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: [
                'eu.europa.ec.eudi.pid.1',
                'urn:eu.europa.ec.eudi:pid:1',
              ],
            },
            claims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
          },
        ],
        credential_sets: [
          {
            options: [['0']],
            purpose:
              'To grant you access we need to verify your ARF compliant PID',
          },
        ],
      };

      const dcql = DCQL.parse(exampleDCQL);
      const notMatchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-1',
        },
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-2',
        },
      ];
      const result = dcql.match(notMatchedCredentials);
      expect(result).toEqual({
        match: false,
      });

      const matchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          family_name: 'Doe',
          given_name: 'John',
        },
      ];
      const result2 = dcql.match(matchedCredentials);
      expect(result2).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: matchedCredentials[0],
            matchedClaims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
            dataIndex: 0,
            credentialQueryId: '0',
          },
        ],
      });
    });

    it('test 5 - single credential, with credential set', () => {
      const exampleDCQL: rawDCQL = {
        credentials: [
          {
            id: '0',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: [
                'eu.europa.ec.eudi.pid.1',
                'urn:eu.europa.ec.eudi:pid:1',
              ],
            },
            claims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
          },
        ],
        credential_sets: [
          {
            options: [['0']],
            purpose:
              'To grant you access we need to verify your ARF compliant PID',
          },
        ],
      };

      const dcql = DCQL.parse(exampleDCQL);
      const notMatchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-1',
        },
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-2',
        },
      ];
      const result = dcql.match(notMatchedCredentials);
      expect(result).toEqual({
        match: false,
      });

      const matchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          family_name: 'Doe',
          given_name: 'John',
        },
      ];
      const result2 = dcql.match(matchedCredentials);
      expect(result2).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: matchedCredentials[0],
            matchedClaims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
            dataIndex: 0,
            credentialQueryId: '0',
          },
        ],
      });
    });

    it('test 6 - multiple credentials, without credential set', () => {
      const exampleDCQL: rawDCQL = {
        credentials: [
          {
            id: '0',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: [
                'eu.europa.ec.eudi.pid.1',
                'urn:eu.europa.ec.eudi:pid:1',
              ],
            },
            claims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
          },
          {
            id: '1',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: ['vct_1', 'vct_2'],
            },
            claims: [
              {
                path: ['data', 'family_name'],
                id: 'family_name',
              },
              {
                path: ['data', 'given_name'],
                id: 'given_name',
              },
            ],
          },
        ],
      };

      const dcql = DCQL.parse(exampleDCQL);
      const notMatched = dcql.match([
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          family_name: 'Doe',
          given_name: 'John',
        },
        {
          vct: 'vct_1',
          family_name: 'Doe',
          given_name: 'John',
        },
      ]);
      expect(notMatched).toEqual({
        match: false,
      });

      const matched = dcql.match([
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          family_name: 'Doe',
          given_name: 'John',
        },
        {
          vct: 'vct_2',
          data: {
            family_name: 'Doe',
            given_name: 'John',
          },
        },
      ]);

      expect(matched).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: {
              vct: 'eu.europa.ec.eudi.pid.1',
              family_name: 'Doe',
              given_name: 'John',
            },
            matchedClaims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
            dataIndex: 0,
            credentialQueryId: '0',
          },
          {
            credential: {
              vct: 'vct_2',
              data: {
                family_name: 'Doe',
                given_name: 'John',
              },
            },
            matchedClaims: [
              {
                path: ['data', 'family_name'],
                id: 'family_name',
              },
              {
                path: ['data', 'given_name'],
                id: 'given_name',
              },
            ],
            dataIndex: 1,
            credentialQueryId: '1',
          },
        ],
      });
    });

    it('test 7 - multiple credentials, with credential set', () => {
      const exampleDCQL: rawDCQL = {
        credentials: [
          {
            id: '0',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: [
                'eu.europa.ec.eudi.pid.1',
                'urn:eu.europa.ec.eudi:pid:1',
              ],
            },
            claims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
          },
          {
            id: '1',
            format: 'dc+sd-jwt',
            meta: {
              vct_values: ['vct_1', 'vct_2'],
            },
            claims: [
              {
                path: ['data', 'family_name'],
                id: 'family_name',
              },
              {
                path: ['data', 'given_name'],
                id: 'given_name',
              },
            ],
          },
        ],
        credential_sets: [
          {
            options: [['0'], ['1']],
          },
        ],
      };

      const dcql = DCQL.parse(exampleDCQL);
      const notMatchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-1',
        },
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          name: 'name-2',
        },
      ];
      const result = dcql.match(notMatchedCredentials);
      expect(result).toEqual({
        match: false,
      });

      const matchedCredentials = [
        {
          vct: 'eu.europa.ec.eudi.pid.1',
          family_name: 'Doe',
          given_name: 'John',
        },
      ];
      const result2 = dcql.match(matchedCredentials);
      expect(result2).toEqual({
        match: true,
        matchedCredentials: [
          {
            credential: matchedCredentials[0],
            matchedClaims: [
              {
                path: ['family_name'],
                id: 'family_name',
              },
              {
                path: ['given_name'],
                id: 'given_name',
              },
            ],
            dataIndex: 0,
            credentialQueryId: '0',
          },
        ],
      });
    });
  });
});
