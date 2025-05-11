import { Inject, Injectable } from '@nestjs/common';
import { OID4VP_OPTIONS } from '../constant';
import { Oid4VpOptions } from '../types/module';

@Injectable()
export class Oid4VpService {
  constructor(
    @Inject(OID4VP_OPTIONS)
    private readonly options: Oid4VpOptions,
  ) {}
}
