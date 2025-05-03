import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Oid4VciModule } from '@vdcs/oid4vci-nestjs';

@Module({
  imports: [
    Oid4VciModule.register({
      credential_issuer: 'http://localhost:3000',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
