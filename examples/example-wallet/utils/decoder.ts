import { decodeSdJwtSync, getClaimsSync } from '@sd-jwt/decode';
import { hasher } from '@sd-jwt/hash';

export class CredentialDecoder {
  /**
   * Decodes a base64url encoded SD-JWT
   *
   * @param sdjwt The base64url encoded SD-JWT to decode
   * @returns header and claims(processed payloads)
   */
  static decodeSDJWT(sdjwt: string) {
    const decoded = decodeSdJwtSync(sdjwt, hasher);
    const header = decoded.jwt.header;

    const claims = getClaimsSync(
      decoded.jwt.payload,
      decoded.disclosures,
      hasher,
    );

    return { header, claims };
  }
}
