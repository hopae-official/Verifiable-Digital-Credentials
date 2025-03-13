import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly verifierUri: string;
  constructor(private readonly configService: ConfigService) {
    this.verifierUri = this.configService.get<string>('VERIFIER_URI');
  }

  start() {
    const query = new URLSearchParams({
      client_id: encodeURI(`redirect_uri:${this.verifierUri}`),
      request_uri: encodeURI(`${this.verifierUri}/request`),
      request_uri_method: 'post',
    });

    return { link: `openid4vp://?${query.toString()}` };
  }

  request() {
    const result = {
      client_id: `redirect_uri:${this.verifierUri}`,
      response_uri: `${this.verifierUri}/response`,
      response_type: 'vp_token',
      response_mode: 'direct_post',
      nonce: 'n-0S6_WzA2Mj',
      dcql_query: '', // TODO: add query
    };

    return result;
  }

  response(vp_token: Record<string, unknown>) {
    console.log('vp_token', vp_token);
    return true;
  }
}
