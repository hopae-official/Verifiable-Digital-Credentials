import axios from 'axios';
import { RequestObject } from './types';
import { decodeJWT } from '@vdcs/jwt';

export class Oid4VpClient {
  constructor(public readonly request: RequestObject) {}

  static async fromRequestUri(requestUri: string) {
    const url = new URL(requestUri);
    const searchParams = new URLSearchParams(url.search);
    const request_uri = searchParams.get('request_uri') ?? '';

    const { data: jwtData } = await axios.get(request_uri);
    const { payload } = decodeJWT(jwtData);
    const request = payload as RequestObject;

    return new Oid4VpClient(request);
  }

  async sendPresentation(vp_token: Record<string, string>) {
    const body = new URLSearchParams();
    body.append('vp_token', JSON.stringify(vp_token));
    if (this.request.state) {
      body.append('state', this.request.state);
    }

    const { data } = await axios.post(this.request.response_uri, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  }
}
