import { Controller } from '@nestjs/common';
import { Oid4VpService } from '../services/oid4vp.service';

@Controller('oid4vp')
export class Oid4VpController {
  constructor(private readonly oid4vpService: Oid4VpService) {}
}
