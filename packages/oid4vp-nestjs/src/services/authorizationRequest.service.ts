import { AuthorizationRequest } from '../types/authorizationRequest';
import { Oid4VpOptions } from '../types/module';

/**
 * Passing as URL with encoded parameters
 * Passing a request object as value
 * Passing a request object by reference
 */

export class AuthorizationRequestService {
  constructor(private readonly options: Oid4VpOptions) {}

  encodedUrl(req: AuthorizationRequest): string {
    const query = new URLSearchParams({
      nonce: req.nonce,
      response_mode: req.response_mode,
      response_type: req.response_type,
      response_uri: req.response_uri,
      client_id: req.client_id,
      dcql_query: JSON.stringify(req.dcql_query),
    });
    if (req.client_metadata) {
      query.set('client_metadata', JSON.stringify(req.client_metadata));
    }
    if (req.request_uri) {
      query.set('request_uri', req.request_uri);
    }
    if (req.request_uri_method) {
      query.set('request_uri_method', req.request_uri_method);
    }
    if (req.transaction_data) {
      query.set('transaction_data', JSON.stringify(req.transaction_data));
    }
    if (req.verifier_attestations) {
      query.set(
        'verifier_attestations',
        JSON.stringify(req.verifier_attestations),
      );
    }
    if (req.scope) {
      query.set('scope', req.scope);
    }
    if (req.state) {
      query.set('state', req.state);
    }
    if (req.transaction_data) {
      query.set('transaction_data', JSON.stringify(req.transaction_data));
    }
    if (req.verifier_attestations) {
      query.set(
        'verifier_attestations',
        JSON.stringify(req.verifier_attestations),
      );
    }

    return `openid4vp://?${query.toString()}`;
  }
}
