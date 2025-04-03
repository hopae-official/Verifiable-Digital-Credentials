import { CredentialType } from '@/types';
import { parseMDL } from './mdl';
import { CredentialDecoder } from '@vdcs/wallet';

export function isValidClaim<T extends object>(
  value: unknown,
  keys: (keyof T)[],
): value is T {
  return (
    typeof value === 'object' &&
    value !== null &&
    keys.every((key) => key in value)
  );
}

export function getCredentialClaims({
  credential,
  type,
}: {
  credential: string;
  type: CredentialType;
}) {
  if (type === 'DriverLicenseCredential') {
    return parseMDL(credential);
  }

  return CredentialDecoder.decodeSDJWT(credential).claims;
}
