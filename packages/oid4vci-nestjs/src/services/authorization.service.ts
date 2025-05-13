import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import {
  AuthorizationCode,
  AuthorizationDetails,
} from '../types/authorization';

@Injectable()
export class AuthorizationService {
  private authorizationCodes = new Map<string, AuthorizationCode>();

  generateAuthorizationCode(
    clientId: string,
    redirectUri: string,
    scope?: string,
    nonce?: string,
    authorizationDetails?: AuthorizationDetails[],
  ): AuthorizationCode {
    const code = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const authCode: AuthorizationCode = {
      code,
      clientId,
      redirectUri,
      scope,
      nonce,
      authorizationDetails,
      expiresAt,
    };

    this.authorizationCodes.set(code, authCode);
    return authCode;
  }

  validateAuthorizationCode(code: string): AuthorizationCode {
    const authCode = this.authorizationCodes.get(code);
    if (!authCode) {
      throw new UnauthorizedException('Invalid authorization code');
    }

    if (authCode.expiresAt < new Date()) {
      this.authorizationCodes.delete(code);
      throw new UnauthorizedException('Authorization code expired');
    }

    return authCode;
  }

  deleteAuthorizationCode(code: string): void {
    this.authorizationCodes.delete(code);
  }

  checkAuthorization(): boolean {
    // @Todo: Check whether user has authorized
    return true;
  }
}
