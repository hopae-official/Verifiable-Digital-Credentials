import {
  Inject,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { OID4VCI_OPTIONS } from './constant';
import { Oid4VciOptions } from './types/module';
import {
  CredentialOffer,
  CredentialOfferOption,
  CredentialOfferResponse,
  TxCode,
} from './types/credential_offer';
import { randomUUID } from 'node:crypto';
import { generateRandom } from './utils';
import { customAlphabet } from 'nanoid';
import { CredentialProvider } from './iservice';

class CredentialOfferGenerator {
  private readonly numbericCodeGen = customAlphabet('1234567890', 4);
  private readonly textCodeGen = customAlphabet(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZ',
    4,
  );

  constructor(
    private readonly credential_issuer: string,
    private readonly protocolName: string = 'openid-credential-offer',
  ) {}

  /**
   * Generate credential offer URI by key
   *
   * @param key - Key of credential offer URI
   * @param path - Path of credential offer URI (Optional) default is '/oid4vci/credential-offer/'
   * @returns Credential offer URI
   */
  byRef(key: string, path: string = '/oid4vci/credential-offer/') {
    const params = new URLSearchParams({
      credential_offer_uri: `${this.credential_issuer}${path}${key}`,
    });
    return `${this.protocolName}://?${params.toString()}`;
  }

  /**
   * Generate credential offer by value
   *
   * @param credential_offer - Credential offer object
   * @returns Credential offer URI
   */
  byValue(credential_offer: CredentialOffer) {
    const params = new URLSearchParams({
      credential_offer: JSON.stringify(credential_offer),
    });
    return `${this.protocolName}://?${params.toString()}`;
  }

  /**
   * Generate transaction code
   *
   * @param tx_code - Transaction code
   * @returns Transaction code value(string)
   */
  txcode(tx_code: TxCode): string {
    const { input_mode = 'numeric', length } = tx_code;
    switch (input_mode) {
      case 'numeric': {
        return this.numbericCodeGen(length);
      }
      case 'text': {
        return this.textCodeGen(length);
      }
    }
  }

  /**
   * Generate pre-authorized code
   *
   * @returns Pre-authorized code (string)
   */
  pre_authorized_code(): string {
    return generateRandom(16);
  }
}

@Injectable()
export class Oid4VciService {
  private readonly credentialOfferUri: CredentialOfferGenerator;

  constructor(
    @Inject(OID4VCI_OPTIONS)
    private readonly options: Oid4VciOptions,
    @Inject(CredentialProvider)
    private readonly credentialProvider: CredentialProvider,
  ) {
    this.credentialOfferUri = new CredentialOfferGenerator(
      options.meta.credential_issuer,
    );
  }

  async findCredentialOffer(key: string): Promise<CredentialOffer> {
    if (!this.credentialProvider.findCredentialOffer) {
      throw new NotImplementedException('Credential provider not found');
    }

    const credentialOffer =
      await this.credentialProvider.findCredentialOffer(key);
    if (!credentialOffer) {
      throw new NotFoundException('Credential offer not found');
    }
    return credentialOffer;
  }

  createCredentialOffer(
    options: CredentialOfferOption,
  ): CredentialOfferResponse {
    const { useRef = false } = options;
    switch (options.type) {
      case 'pre-authorized_code': {
        const { tx_code, authorization_server } = options;
        const pre_authorized_code =
          this.credentialOfferUri.pre_authorized_code();
        const rawCredentialOffer: CredentialOffer = {
          credential_issuer: this.options.meta.credential_issuer,
          credential_configuration_ids:
            options.credential_configuration_ids ?? [],
          grants: {
            'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
              pre_authorized_code,
              tx_code,
              authorization_server,
            },
          },
        };
        const credentialOffer =
          this.credentialOfferUri.byValue(rawCredentialOffer);

        const txCodeValue = tx_code
          ? this.credentialOfferUri.txcode(tx_code)
          : undefined;

        if (useRef) {
          const uuid = randomUUID();
          const credential_offer_uri = this.credentialOfferUri.byRef(uuid);
          this.credentialProvider.registerCredentialOffer?.(
            uuid,
            rawCredentialOffer,
          );
          return {
            raw: rawCredentialOffer,
            credential_offer: credentialOffer,
            credential_offer_uri,
            credential_offer_uri_key: uuid,
            pre_authorized_code,
            tx_code: txCodeValue,
          };
        }

        return {
          raw: rawCredentialOffer,
          credential_offer: credentialOffer,
          pre_authorized_code,
          tx_code: txCodeValue,
        };
      }
      case 'authorization_code': {
        const {
          issuer_state,
          authorization_server,
          credential_configuration_ids = [],
        } = options;

        const grants =
          issuer_state || authorization_server
            ? { authorization_code: { issuer_state, authorization_server } }
            : undefined;

        const rawCredentialOffer = {
          credential_issuer: this.options.meta.credential_issuer,
          credential_configuration_ids,
          grants,
        };
        const credentialOffer =
          this.credentialOfferUri.byValue(rawCredentialOffer);

        if (useRef) {
          const uuid = randomUUID();
          const credential_offer_uri = this.credentialOfferUri.byRef(uuid);
          this.credentialProvider.registerCredentialOffer?.(
            uuid,
            rawCredentialOffer,
          );
          return {
            raw: rawCredentialOffer,
            credential_offer: credentialOffer,
            credential_offer_uri,
            credential_offer_uri_key: uuid,
          };
        }

        return {
          raw: rawCredentialOffer,
          credential_offer: credentialOffer,
        };
      }
    }
  }
}
