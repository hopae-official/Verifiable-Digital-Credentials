import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Oid4VpModule, Oid4VpOptions } from '@vdcs/oid4vp-nestjs';

const options: Oid4VpOptions = {
  credential_verifier: 'test-verifier',
};

@Module({
  imports: [Oid4VpModule.register(options)],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
