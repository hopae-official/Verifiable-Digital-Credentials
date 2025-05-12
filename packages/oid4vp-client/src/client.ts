import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  CredentialQuery,
  DcqlQuery,
  SendAuthorizationResponseOptions,
} from './types';

export class Oid4VpClient {
  private axios: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.axios = axios.create(config);
  }

  async fetchAuthorizationRequest(requestUri: string) {
    const response = await this.axios.get(requestUri);
    return response.data;
  }

  /**
   * Filter Verifiable Credentials based on DCQL query
   * @param query DCQL query
   * @param vcs Array of Verifiable Credentials
   * @returns Matching Verifiable Credentials
   */
  async filterVCsByDCQL(query: DcqlQuery, vcs: any[]): Promise<any[]> {
    const matchingVCs: any[] = [];

    // Process individual credential queries
    if (query.credentials) {
      for (const credQuery of query.credentials) {
        const matches = vcs.filter((vc) =>
          this.matchesCredentialQuery(vc, credQuery),
        );
        if (matches.length > 0) {
          if (credQuery.multiple) {
            matchingVCs.push(...matches);
          } else {
            matchingVCs.push(matches[0]);
          }
        }
      }
    }

    // Process credential set queries
    if (query.credential_sets) {
      for (const setQuery of query.credential_sets) {
        for (const option of setQuery.options) {
          const allMatched = option.credentials.every((credQuery) => {
            return vcs.some((vc) => this.matchesCredentialQuery(vc, credQuery));
          });

          if (allMatched || !option.required) {
            const matches = option.credentials.flatMap((credQuery) =>
              vcs.filter((vc) => this.matchesCredentialQuery(vc, credQuery)),
            );
            matchingVCs.push(...matches);
          }
        }
      }
    }

    return [...new Set(matchingVCs)];
  }

  private matchesCredentialQuery(vc: any, query: CredentialQuery): boolean {
    // Format check
    if (query.format && vc.format !== query.format) {
      return false;
    }

    // Trusted authorities check
    if (query.trusted_authorities) {
      const matchesTrustedAuthority = query.trusted_authorities.some(
        (authority) => {
          switch (authority.type) {
            case 'aki':
              return authority.values.includes(vc.issuer?.aki);
            case 'etsi_tl':
              return authority.values.includes(vc.issuer?.tl);
            case 'openid_federation':
              return authority.values.includes(vc.issuer?.federation);
            default:
              return false;
          }
        },
      );
      if (!matchesTrustedAuthority) {
        return false;
      }
    }

    // Claims check
    if (query.claims) {
      const matchesClaims = query.claims.every((claim) => {
        const value = this.getValueByPath(vc, claim.path);
        return !claim.values || claim.values.includes(value);
      });
      if (!matchesClaims) {
        return false;
      }
    }

    return true;
  }

  private getValueByPath(obj: any, path: string[]): any {
    return path.reduce((current, key) => current?.[key], obj);
  }

  async createVpToken() {
    //@Todo: Implement createVpToken
  }

  /**
   * Send authorization response to the verifier
   * @param options Options for sending authorization response
   * @returns Response from the verifier
   */
  async sendAuthorizationResponse(
    options: SendAuthorizationResponseOptions,
  ): Promise<any> {
    const { responseUri, vpToken, state } = options;

    const response = await this.axios.post(responseUri, null, {
      params: {
        response_type: 'vp_token',
        vp_token: vpToken,
        state: state,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data;
  }
}
