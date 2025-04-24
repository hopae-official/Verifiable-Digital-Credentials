import { Module, DynamicModule, Provider } from '@nestjs/common';
import {
  Oid4VciModuleOptions,
  Oid4VciModuleAsyncOptions,
  Oid4VciOptionsFactory,
} from './type';
import { OID4VCI_OPTIONS, OID4VCI_SERVICE } from './constant';
import { Oid4VciService } from './oid4vci.service';
import { CredentialProvider } from './iservice';
import { CredentialService } from './credential.service';

@Module({})
export class Oid4VciModule {
  static register(moduleOptions: Oid4VciModuleOptions): DynamicModule {
    const providers = this.createProviders(moduleOptions);
    return {
      module: Oid4VciModule,
      providers,
      exports: [OID4VCI_SERVICE],
    };
  }

  static registerAsync(options: Oid4VciModuleAsyncOptions): DynamicModule {
    return {
      module: Oid4VciModule,
      imports: options.imports || [],
      providers: [
        ...this.createAsyncProviders(options),
        {
          provide: OID4VCI_SERVICE,
          useFactory: (moduleOptions: Oid4VciModuleOptions) => {
            const credentialProvider: CredentialProvider =
              moduleOptions.credentialProvider
                ? new moduleOptions.credentialProvider()
                : new CredentialService(); // use default credential service

            return new Oid4VciService(
              moduleOptions.options,
              credentialProvider,
            );
          },
          inject: [OID4VCI_OPTIONS],
        },
      ],
      exports: [OID4VCI_SERVICE],
    };
  }

  private static createAsyncProviders(
    options: Oid4VciModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    if (!options.useClass) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: Oid4VciModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: OID4VCI_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // useFactory and useExisting/useClass are mutually exclusive
    const injectOption = options.useExisting || options.useClass;

    if (!injectOption) {
      throw new Error(
        'Invalid configuration. Must provide useFactory, useClass or useExisting',
      );
    }

    return {
      provide: OID4VCI_OPTIONS,
      useFactory: async (optionsFactory: Oid4VciOptionsFactory) =>
        await optionsFactory.createOid4VciOptions(),
      inject: [injectOption],
    };
  }

  private static createProviders(
    moduleOptions: Oid4VciModuleOptions,
  ): Provider[] {
    const optionsProvider = {
      provide: OID4VCI_OPTIONS,
      useValue: moduleOptions,
    };

    const serviceProvider: Provider = {
      provide: OID4VCI_SERVICE,
      useFactory: (options: Oid4VciModuleOptions) => {
        const credentialProvider: CredentialProvider =
          options.credentialProvider
            ? new options.credentialProvider()
            : new CredentialService(); // use default credential service

        return new Oid4VciService(options.options, credentialProvider);
      },
      inject: [OID4VCI_OPTIONS],
    };

    return [optionsProvider, serviceProvider];
  }
}
