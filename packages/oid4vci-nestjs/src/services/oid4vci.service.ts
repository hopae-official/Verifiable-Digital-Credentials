import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { OID4VCI_OPTIONS } from '../constant';
import { Oid4VciOptions } from '../types/module';
import {
  CredentialOffer,
  CredentialOfferOption,
  CredentialOfferResponse,
} from '../types/credential_offer';
import { randomUUID } from 'node:crypto';
import { CredentialProvider } from '../iservice';
import jwt from 'jsonwebtoken';
import { CredentialOfferGenerator } from './credentialOffer.service';
import { NotificationDto } from '../dto/notification.dto';
import { CredentialIssuerMetadata } from '../types/meta';

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

  getIssuerMetadata(): CredentialIssuerMetadata {
    const credentialIssuer = this.options.meta.credential_issuer;
    return {
      credential_issuer: credentialIssuer,
      credential_endpoint: `${credentialIssuer}/credential`,
      nonce_endpoint: `${credentialIssuer}/nonce`,
      credential_configurations_supported:
        this.options.meta.credential_configurations_supported,
      display: this.options.meta.display ?? [],
    };
  }

  private generateNonceJwt() {
    if (!this.options.nonce?.secret) {
      throw new InternalServerErrorException('Nonce secret not found');
    }
    const { secret, expiresIn } = this.options.nonce;
    const uuid = randomUUID();
    return jwt.sign({ jti: uuid }, secret, {
      expiresIn: expiresIn ?? '5m',
      issuer: this.options.meta.credential_issuer,
    });
  }

  async createNonce() {
    if (!this.options.nonce || !this.credentialProvider.registerNonce) {
      throw new NotImplementedException('registerNonce not found');
    }

    const nonce = this.generateNonceJwt();
    await this.credentialProvider.registerNonce(
      nonce,
      this.options.nonce.expiresIn ?? '5m',
    );
    return nonce;
  }

  async checkNonce(nonce: string) {
    if (!this.options.nonce || !this.credentialProvider.findNonce) {
      throw new NotImplementedException('findNonce not found');
    }

    return this.credentialProvider.findNonce(nonce);
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
              'pre-authorized_code': pre_authorized_code,
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
            'pre-authorized_code': pre_authorized_code,
            tx_code: txCodeValue,
          };
        }

        return {
          raw: rawCredentialOffer,
          credential_offer: credentialOffer,
          'pre-authorized_code': pre_authorized_code,
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

  async notification(notification: NotificationDto) {
    if (!this.credentialProvider.notification) {
      throw new NotImplementedException('notification handler not found');
    }

    await this.credentialProvider.notification(notification);
  }

  async deferredCredential(transaction_id: string) {
    if (!this.credentialProvider.deferredCredential) {
      throw new NotImplementedException('deferredCredential handler not found');
    }
    // TODO: error response
    return this.credentialProvider.deferredCredential(transaction_id);
  }

  getAuthorizationServerMetadata() {
    return this.options.meta.authorization_server;
  }
}
