import { Module, DynamicModule } from '@nestjs/common';
import { OID4VP_OPTIONS } from './constant';
import { Oid4VpOptions } from './types/module';
import { Oid4VpService } from './services/oid4vp.service';
import { Oid4VpController } from './controllers/oid4vp.controller';
import { RequestController } from './controllers/request.controller';

@Module({})
export class Oid4VpModule {
  static register(options: Oid4VpOptions): DynamicModule {
    return {
      module: Oid4VpModule,
      imports: [],
      controllers: [Oid4VpController, RequestController],
      providers: [
        {
          provide: OID4VP_OPTIONS,
          useValue: options,
        },
        Oid4VpService,
      ],
      exports: [Oid4VpService],
    };
  }

  static registerAsync(asyncOptions: {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<Oid4VpOptions> | Oid4VpOptions;
    inject?: any[];
  }): DynamicModule {
    return {
      module: Oid4VpModule,
      imports: asyncOptions.imports || [],
      controllers: [Oid4VpController, RequestController],
      providers: [
        {
          provide: OID4VP_OPTIONS,
          useFactory: async (...args: any[]) => {
            const options = await asyncOptions.useFactory(...args);
            return options;
          },
          inject: asyncOptions.inject || [],
        },
        Oid4VpService,
      ],
      exports: [Oid4VpService],
    };
  }
}
