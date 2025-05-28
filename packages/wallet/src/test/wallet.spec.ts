import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { VDCsWallet } from '../walllet';
import { WalletStorage } from '../types/storage';
import { Oid4VciClient } from '@vdcs/oid4vci-client';
import { Oid4VpClient } from '@vdcs/oid4vp-client';
import { CredentialOffer, CredentialResponse } from '@vdcs/oid4vci';

vi.mock('@vdcs/oid4vci-client');
vi.mock('@vdcs/oid4vp-client');

describe('VDCsWallet', () => {
  let wallet: VDCsWallet;
  let mockStorage: WalletStorage;
  let mockOid4VciClient: {
    fetchCredentialOffer: Mock<[string], Promise<CredentialOffer>>;
    fetchCredentialIssuerMetadata: Mock;
    fetchAuthorizationServerMetadata: Mock;
    getAccessToken: Mock<[string, string], Promise<string>>;
    requestCredential: Mock<[string, string], Promise<CredentialResponse>>;
  };

  const mockIssuerUrl = 'https://example.com';
  const mockCredentialOffer: CredentialOffer = {
    credential_issuer: mockIssuerUrl,
    credential_configuration_ids: ['UniversityDegreeCredential'],
    grants: {
      'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
        'pre-authorized_code': 'mock_code',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };

    mockOid4VciClient = {
      fetchCredentialOffer: vi.fn(),
      fetchCredentialIssuerMetadata: vi.fn(),
      fetchAuthorizationServerMetadata: vi.fn(),
      getAccessToken: vi.fn(),
      requestCredential: vi.fn(),
    };

    vi.mocked(Oid4VciClient).mockImplementation(
      () => mockOid4VciClient as unknown as Oid4VciClient,
    );
    vi.mocked(Oid4VpClient).mockImplementation(() => ({}) as Oid4VpClient);

    wallet = new VDCsWallet({ storage: mockStorage });
  });

  describe('fetchCredentialOffer', () => {
    it('should fetch and store credential offer', async () => {
      mockOid4VciClient.fetchCredentialOffer.mockResolvedValue(
        mockCredentialOffer,
      );

      const result = await wallet.fetchCredentialOffer(mockIssuerUrl);

      expect(mockOid4VciClient.fetchCredentialOffer).toHaveBeenCalledWith(
        mockIssuerUrl,
      );
      expect(result).toEqual(mockCredentialOffer);
    });

    it('should throw error if fetch fails', async () => {
      const error = new Error('Network error');
      mockOid4VciClient.fetchCredentialOffer.mockRejectedValue(error);

      await expect(wallet.fetchCredentialOffer(mockIssuerUrl)).rejects.toThrow(
        'Network error',
      );
    });
  });

  describe('issueCredential', () => {
    const mockCredentialType = 'UniversityDegreeCredential';
    const mockAccessToken = 'mock_access_token';
    const mockCredential: CredentialResponse = {
      credentials: [
        {
          credential: 'mock_credential_jwt',
        },
      ],
    };

    beforeEach(async () => {
      // Setup credential offer first
      mockOid4VciClient.fetchCredentialOffer.mockResolvedValue(
        mockCredentialOffer,
      );
      await wallet.fetchCredentialOffer(mockIssuerUrl);
    });

    it('should issue credential with pre-authorized code grant', async () => {
      mockOid4VciClient.fetchCredentialIssuerMetadata.mockResolvedValue({});
      mockOid4VciClient.fetchAuthorizationServerMetadata.mockResolvedValue({});
      mockOid4VciClient.getAccessToken.mockResolvedValue(mockAccessToken);
      mockOid4VciClient.requestCredential.mockResolvedValue(mockCredential);

      const result = await wallet.issueCredential({
        credentialType: mockCredentialType,
      });

      expect(
        mockOid4VciClient.fetchCredentialIssuerMetadata,
      ).toHaveBeenCalled();
      expect(
        mockOid4VciClient.fetchAuthorizationServerMetadata,
      ).toHaveBeenCalled();
      expect(mockOid4VciClient.getAccessToken).toHaveBeenCalledWith(
        'mock_code',
        'mockTxCode',
      );
      expect(mockOid4VciClient.requestCredential).toHaveBeenCalledWith(
        mockAccessToken,
        mockCredentialType,
      );
      expect(result).toEqual(mockCredential);
    });

    it('should throw error if credential offer is not set', async () => {
      wallet = new VDCsWallet({ storage: mockStorage }); // Create new wallet without credential offer

      await expect(
        wallet.issueCredential({ credentialType: mockCredentialType }),
      ).rejects.toThrow('Credential offer not found');
    });

    it('should throw error if metadata fetch fails', async () => {
      mockOid4VciClient.fetchCredentialIssuerMetadata.mockRejectedValue(
        new Error('Metadata fetch failed'),
      );

      await expect(
        wallet.issueCredential({ credentialType: mockCredentialType }),
      ).rejects.toThrow('Metadata fetch failed');
    });

    it('should throw error if access token request fails', async () => {
      mockOid4VciClient.fetchCredentialIssuerMetadata.mockResolvedValue({});
      mockOid4VciClient.fetchAuthorizationServerMetadata.mockResolvedValue({});
      mockOid4VciClient.getAccessToken.mockRejectedValue(
        new Error('Token request failed'),
      );

      await expect(
        wallet.issueCredential({ credentialType: mockCredentialType }),
      ).rejects.toThrow('Token request failed');
    });
  });
});
