import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NonceService } from './nonce.service';
import { TokenService } from './token.service';
import { CredentialService } from './credential.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NonceService, TokenService, CredentialService],
})
export class AppModule {}
