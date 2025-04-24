import { Module, DynamicModule, Provider } from '@nestjs/common';
import { Oid4VciOptions } from './type';
import { OID4VCI_SERVICE } from './constant';
import { Oid4VciService } from './oid4vci.service';

@Module({})
export class Oid4VciModule {
  static register(options: Oid4VciOptions): DynamicModule {
    return {
      module: Oid4VciModule,
      providers: [
        {
          provide: OID4VCI_SERVICE,
          useValue: new Oid4VciService(options),
        },
      ],
      exports: [OID4VCI_SERVICE],
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
      providers: [
        {
          provide: OID4VCI_SERVICE,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory(...args);
            return new Oid4VciService(options);
          },
          inject: asyncOptions.inject || [],
        },
      ],
      exports: [OID4VCI_SERVICE],
    };
  }
}
