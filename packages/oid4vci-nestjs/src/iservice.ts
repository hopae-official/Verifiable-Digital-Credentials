import { SignOptions } from 'jsonwebtoken';
import { CredentialOffer } from './types/credential_offer';
import { NotificationDto } from './dto/notification.dto';
import { DeferredCredentialResponseDto } from './dto/deferredCredential.dto';
import { TokenDto } from './dto/token.dto';
import { ValidatePreAuthorizedCodeResponseDto } from './types/token';
import { CredentialResponse } from './types/credential';
import { CredentialDto } from './dto/credential.dto';

export abstract class CredentialProvider {
  abstract issueCredential(dto: CredentialDto): Promise<CredentialResponse>;

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

  /**
   * Register nonce.
   * This method is needed when you use nonce to get credential offer value.
   *
   * @param nonce - Nonce
   * @param ttl - Time to live
   */
  abstract registerNonce?(
    nonce: string,
    ttl: SignOptions['expiresIn'],
  ): Promise<void>;

  /**
   * Find nonce.
   * This method is needed when you use nonce to get credential offer value.
   *
   * @param nonce - Nonce
   * @returns true if nonce exists, false otherwise
   */
  abstract findNonce?(nonce: string): Promise<boolean>;

  abstract notification?(notification: NotificationDto): Promise<void>;

  abstract deferredCredential?(
    transaction_id: string,
  ): Promise<DeferredCredentialResponseDto>;

  abstract validatePreAuthorizedCode?(
    dto: TokenDto,
  ): Promise<ValidatePreAuthorizedCodeResponseDto>;
}
