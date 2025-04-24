import { Injectable } from '@nestjs/common';
import { Oid4VciOptions } from './type';

@Injectable()
export class Oid4VciService {
  constructor(private readonly options: Oid4VciOptions) {}
}
