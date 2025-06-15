import { rawDCQL } from '@vdcs/dcql';

export type RequestObject = {
  response_type: string;
  client_id: string;
  response_uri: string;
  response_mode: 'direct_post' | 'direct_post.jwt';
  nonce: string;
  dcql_query: rawDCQL;
  state?: string;
};
