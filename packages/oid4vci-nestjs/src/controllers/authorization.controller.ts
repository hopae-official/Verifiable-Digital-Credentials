import { Controller, Get, Query, BadRequestException } from '@nestjs/common';

import { AuthorizationService } from '../services/authorization.service';
import { AuthorizationRequestDto } from '../dto/authorization.dto';

@Controller()
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Get('authorize')
  async authorize(@Query() authRequest: AuthorizationRequestDto) {
    if (
      !authRequest.response_type ||
      !authRequest.client_id ||
      !authRequest.redirect_uri
    ) {
      throw new BadRequestException('Missing required parameters');
    }

    if (authRequest.response_type !== 'code') {
      throw new BadRequestException(
        'Invalid response_type. Only "code" is supported',
      );
    }

    if (!this.authorizationService.checkAuthorization()) {
      // @Todo: Implement checkAuthorization logic
    }

    const authCode = this.authorizationService.generateAuthorizationCode(
      authRequest.client_id,
      authRequest.redirect_uri,
      authRequest.scope,
      undefined,
      authRequest.authorization_details,
    );

    const redirectUrl = new URL(authRequest.redirect_uri);
    redirectUrl.searchParams.set('code', authCode.code);
    if (authRequest.state) {
      redirectUrl.searchParams.set('state', authRequest.state);
    }

    return {
      statusCode: 302,
      url: redirectUrl.toString(),
    };
  }
}
