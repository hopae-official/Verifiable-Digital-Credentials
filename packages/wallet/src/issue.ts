import axios from 'axios';

type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: string[];
  'pre-authorized_code': string;
  tx_code?: {
    length: number;
    input_mode: string;
    description: string;
  };
};

type CredentialMeta = {
  credential_endpoint: string;
  credential_configurations_supported?: Record<
    string,
    { format: string; display: { name: string; locale: string }[] }
  >;
  display?: { name: string; locale: string; logo?: { uri: string } }[];
};

type AuthorizationServerMeta = {
  token_endpoint: string;
};

type CredentialResponse = {
  credentials: {
    credential: string;
  }[];
};

export type Oid4vciClientMeta = {
  meta: {
    credential_issuer: string;
    credential_configurations_supported?: Record<
      string,
      { format: string; display: { name: string; locale: string }[] }
    >;
    display?: { name: string; locale: string; logo?: { uri: string } }[];
  };
  endpoints: {
    credential: string;
    nonce?: string;
    deferred_credential?: string;
    notification?: string;
    token: string;
  };
  credentialOffer?: CredentialOffer;
};

export class Oid4vciClient {
  private readonly _meta: Oid4vciClientMeta;
  private _access_token?: string;

  constructor(meta: Oid4vciClientMeta) {
    this._meta = meta;
  }

  get meta() {
    return this._meta;
  }

  get accessToken() {
    return this._access_token;
  }

  static async fromIssuer(issuer: string) {
    const { data: credentialMeta } = await axios.get<CredentialMeta>(
      `${issuer}/.well-known/openid-credential-issuer`,
    );

    const {
      credential_endpoint,
      credential_configurations_supported,
      display,
    } = credentialMeta;

    const { data: authMeta } = await axios.get<AuthorizationServerMeta>(
      `${issuer}/.well-known/oauth-authorization-server`,
    );

    const { token_endpoint } = authMeta;

    return new Oid4vciClient({
      meta: {
        credential_issuer: issuer,
        credential_configurations_supported,
        display,
      },
      endpoints: {
        credential: credential_endpoint,
        token: token_endpoint,
      },
    });
  }

  static async fromOffer(offer: string) {
    const { protocol, searchParams } = new URL(offer);
    if (protocol !== 'openid-credential-offer:') {
      // it has to be openid-credential-offer:
      throw new Error('Invalid protocol');
    }

    const credentialOfferUri = searchParams.get('credential_offer_uri');

    if (!credentialOfferUri) {
      throw new Error('Missing credential_offer_uri');
    }

    const { data: credentialOffer } =
      await axios.get<CredentialOffer>(credentialOfferUri);

    const { credential_issuer } = credentialOffer;
    return Oid4vciClient.fromIssuer(credential_issuer);
  }

  async credential(tx_code: string, credential_identifier?: string) {
    if (!this._meta.credentialOffer) {
      throw new Error('Missing credential offer');
    }

    const tokenEndpoint = this._meta.endpoints.token;

    const { data: token } = await axios.post(tokenEndpoint, {
      grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
      pre_authorized_code: this._meta.credentialOffer['pre-authorized_code'],
      tx_code,
    });

    this._access_token = token.access_token;

    const credentialEndpoint = this._meta.endpoints.credential;
    const credentialIdentifier =
      credential_identifier ??
      this._meta.credentialOffer.credential_configuration_ids[0];

    const { data: credentials } = await axios.post<CredentialResponse>(
      credentialEndpoint,
      {
        credential_identifier: credentialIdentifier,
      },
      {
        headers: {
          Authorization: `Bearer ${this._access_token}`,
        },
      },
    );

    return credentials;
  }
}
