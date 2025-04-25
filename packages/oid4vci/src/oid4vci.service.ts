import { Inject, Injectable } from '@nestjs/common';
import { OID4VCI_OPTIONS } from './constant';
import { Oid4VciOptions } from './type';

@Injectable()
export class Oid4VciService {
  constructor(
    @Inject(OID4VCI_OPTIONS)
    private readonly options: Oid4VciOptions,
  ) {}
}
