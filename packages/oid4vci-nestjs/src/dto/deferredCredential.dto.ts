import { IsNotEmpty, IsString } from 'class-validator';

export class DeferredCredentialDto {
  @IsString()
  @IsNotEmpty()
  transaction_id: string;
}

export class DeferredCredentialResponseDto {
  credentials: Array<{ credential: string }>;
  notification_id?: string;
}
