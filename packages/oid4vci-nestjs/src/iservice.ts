import { CredentialOffer } from './types/credential_offer';

export abstract class CredentialProvider {
  abstract issueCredential(): Promise<void>; // TODO: implement

  /**
   * Register credential offer.
   * This method is needed when you use credential_offer_uri to get credential offer value.
   *
   * @param key - Key of credential offer URI
   * @param credential_offer - Credential offer
   */
  abstract registerCredentialOffer?(
    key: string,
    credential_offer: CredentialOffer,
  ): Promise<void>;

  /**
   * Find credential offer by key.
   * This method is needed when you use credential_offer_uri to get credential offer value.
   *
   * @param key - Key of credential offer URI
   * @returns Credential offer or null
   */
  abstract findCredentialOffer?(
    key: string,
  ): Promise<CredentialOffer | null | undefined>;
}
