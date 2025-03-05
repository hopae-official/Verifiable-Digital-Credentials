import { Injectable } from '@nestjs/common';
import { CredentialDto } from './dto';

@Injectable()
export class CredentialService {
  create(dto: CredentialDto) {
    return {
      credentials: [
        {
          credential: '', // TODO: fill in
        },
      ],
    };
  }
}
