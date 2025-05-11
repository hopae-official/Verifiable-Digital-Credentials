import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { OID4VP_OPTIONS } from '../constant';
import { Oid4VpOptions } from '../types/module';
import { AuthorizationRequest } from '../types/authorizationRequest';
import { AuthorizationRequestService } from './authorizationRequest.service';
import { VpToken } from '../types/vp_token';

@Injectable()
export class Oid4VpService {
  private readonly authorizationRequestService: AuthorizationRequestService;

  constructor(
    @Inject(OID4VP_OPTIONS)
    private readonly options: Oid4VpOptions,
  ) {
    this.authorizationRequestService = new AuthorizationRequestService(
      this.options,
    );
  }

  async getRequestString(): Promise<string> {
    throw new NotImplementedException();
  }

  async getRequest(): Promise<AuthorizationRequest> {
    throw new NotImplementedException();
  }

  async verifyVpToken(vp_token: VpToken) {
    throw new NotImplementedException();
  }
}
