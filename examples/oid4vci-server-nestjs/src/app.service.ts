import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(private readonly oid4vciService: Oid4VciService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
