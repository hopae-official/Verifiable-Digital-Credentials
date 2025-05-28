import { WalletStorage } from './types/storage';
import { Oid4VciClient } from '@vdcs/oid4vci-client';
import { Oid4VpClient } from '@vdcs/oid4vp-client';
import { CredentialOffer, isPreAuthorizedCodeGrant } from '@vdcs/oid4vci';

export class VDCsWallet {
  private readonly storage: WalletStorage;
  private readonly oid4VciClient: Oid4VciClient;
  private readonly oid4VpClient: Oid4VpClient;
  private credentialOffer: CredentialOffer | null = null;

  constructor({ storage }: { storage: WalletStorage }) {
    this.storage = storage;
    this.oid4VciClient = new Oid4VciClient();
    this.oid4VpClient = new Oid4VpClient();
  }

  async fetchCredentialOffer(issuerUrl: string): Promise<CredentialOffer> {
    const credentialOffer =
      await this.oid4VciClient.fetchCredentialOffer(issuerUrl);
    this.credentialOffer = credentialOffer;
    return credentialOffer;
  }

  async issueCredential({ credentialType }: { credentialType: string }) {
    if (!this.credentialOffer) {
      throw new Error('Credential offer not found');
    }

    await this.oid4VciClient.fetchCredentialIssuerMetadata();

    await this.oid4VciClient.fetchAuthorizationServerMetadata();

    if (isPreAuthorizedCodeGrant(this.credentialOffer)) {
      const preAuthorizedGrant =
        this.credentialOffer.grants[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ];

      const preAuthorizedCode = preAuthorizedGrant['pre-authorized_code'];

      const accessToken = await this.oid4VciClient.getAccessToken(
        preAuthorizedCode,
        'mockTxCode', // Todo: Replace with actual txCode
      );

      const credential = await this.oid4VciClient.requestCredential(
        accessToken,
        credentialType,
      );

      // Todo: Add issuance state and error handling

      return credential;
    } else {
      // Todo: handle authorization flow
      throw new Error('Authorization flow not implemented');
    }
  }
}
