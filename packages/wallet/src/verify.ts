import axios from 'axios';

export type Oid4vpClientMeta = {
  meta: {
    verifier: string;
  };
  request: {
    client_id: string;
    response_uri: string;
    response_type: string;
    response_mode: string;
    nonce: string;
    dcql_query: { required: string[]; optional: string[] };
  };
};

export class Oid4vpClient {
  constructor(private readonly _meta: Oid4vpClientMeta) {}

  get meta() {
    return this._meta;
  }

  static async fromRequest(request: string) {
    const { protocol, searchParams } = new URL(request);
    if (protocol !== 'openid4vp:') {
      // it has to be openid4vp:
      throw new Error('Invalid protocol');
    }

    const requestUri = searchParams.get('request_uri');
    const clientId = searchParams.get('client_id');

    if (!requestUri || !clientId) {
      throw new Error('Missing request_uri or client_id');
    }

    const request_uri_method = searchParams.get('request_uri_method') ?? 'get';

    const { data: requestData } =
      request_uri_method === 'post'
        ? await axios.post(requestUri, searchParams)
        : await axios.get(requestUri);

    const verifier = clientId.split(':')[1];

    return new Oid4vpClient({
      meta: {
        verifier,
      },
      request: {
        ...requestData,
        dcql_query: JSON.parse(requestData.dcql_query),
      },
    });
  }

  async present(vp_token: string) {
    const responseUri = this._meta.request.response_uri;
    const responseMode = this._meta.request.response_mode;
    if (responseMode !== 'direct_post') {
      throw new Error('Invalid response mode');
    }

    const { data } = await axios.post(responseUri, { vp_token });
    return data;
  }
}
