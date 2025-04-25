import { Controller } from '@nestjs/common';
import { Oid4VciService } from './oid4vci.service';

@Controller('oid4vci')
export class Oid4VciController {
  constructor(private readonly oid4vciService: Oid4VciService) {}
}
