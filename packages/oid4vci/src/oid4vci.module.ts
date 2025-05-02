import { Module, DynamicModule } from '@nestjs/common';
import { Oid4VciOptions } from './type';
import { OID4VCI_OPTIONS } from './constant';
import { Oid4VciService } from './oid4vci.service';
import { Oid4VciController } from './oid4vci.controller';

@Module({})
export class Oid4VciModule {
  static register(options: Oid4VciOptions): DynamicModule {
    return {
      module: Oid4VciModule,
      imports: [],
      controllers: [Oid4VciController],
      providers: [
        {
          provide: OID4VCI_OPTIONS,
          useValue: options,
        },
        Oid4VciService,
      ],
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
      controllers: [Oid4VciController],
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
      ],
    };
  }
}
