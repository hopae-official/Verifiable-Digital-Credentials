import { Module, DynamicModule, Provider } from '@nestjs/common';
import { Oid4VciOptions } from './types/module';
import { OID4VCI_OPTIONS } from './constant';
import { Oid4VciService } from './services/oid4vci.service';
import { Oid4VciController } from './controllers/oid4vci.controller';
import { NonceController } from './controllers/nonce.controller';
import { TokenController } from './controllers/token.controller';
import { NotificationController } from './controllers/notification.controller';
import { DeferredCredentialController } from './controllers/deferred_credential.controller';
import { CredentialProvider } from './iservice';
import { CredentialService } from './services/credential.service';
import { CredentialOfferUriController } from './controllers/credential_offer_uri.controller';
import { JwtService } from './services/jwt.service';

@Module({})
export class Oid4VciModule {
  static register(options: Oid4VciOptions): DynamicModule {
    const credential_provider: Provider = {
      provide: CredentialProvider,
      useClass: options.credential_provider || CredentialService,
    };
    return {
      module: Oid4VciModule,
      imports: [],
      controllers: [
        Oid4VciController, // TODO: optionally include
        NonceController,
        TokenController,
        NotificationController,
        DeferredCredentialController,
        CredentialOfferUriController,
      ],
      providers: [
        credential_provider,
        {
          provide: OID4VCI_OPTIONS,
          useValue: options,
        },
        Oid4VciService,
        JwtService,
      ],
      exports: [Oid4VciService],
    };
  }

  static registerAsync(asyncOptions: {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<Oid4VciOptions> | Oid4VciOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: Oid4VciModule,
      imports: asyncOptions.imports || [],
      controllers: [
        Oid4VciController, // TODO: optionally include
        NonceController,
        TokenController,
        NotificationController,
        DeferredCredentialController,
        CredentialOfferUriController,
      ],
      providers: [
        {
          provide: OID4VCI_OPTIONS,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory(...args);
            return options;
          },
          inject: asyncOptions.inject || [],
        },
        Oid4VciService,
        JwtService,
        {
          provide: CredentialProvider,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory(...args);
            return options.credential_provider || CredentialService;
          },
          inject: asyncOptions.inject || [],
        },
      ],
      exports: [Oid4VciService],
    };
  }
}
