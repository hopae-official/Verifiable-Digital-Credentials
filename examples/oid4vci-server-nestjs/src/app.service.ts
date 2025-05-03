import { Injectable } from '@nestjs/common';
import { Oid4VciService } from '@vdcs/oid4vci-nestjs';

@Injectable()
export class AppService {
  constructor(private readonly oid4vciService: Oid4VciService) {}
  getHello(): string {
    return 'Hello World!';
  }

  createCredentialOffer() {
    const results = this.oid4vciService.createCredentialOffer({
      type: 'pre-authorized_code',
      credential_configuration_ids: ['MyCredential'],
      tx_code: {
        input_mode: 'numeric',
        length: 4,
      },
      useRef: true,
    });
    console.log('credential offer:', results);
    const { credential_offer_uri } = results;
    return credential_offer_uri;
  }
}
