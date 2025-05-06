import {
  PreAuthorizedCodeGrant,
  CredentialOffer,
} from '../types/credential_offer';

export function isPreAuthorizedCodeGrant(
  offer: CredentialOffer,
): offer is CredentialOffer & { grants: PreAuthorizedCodeGrant } {
  return (
    !!offer.grants &&
    'urn:ietf:params:oauth:grant-type:pre-authorized_code' in offer.grants
  );
}
