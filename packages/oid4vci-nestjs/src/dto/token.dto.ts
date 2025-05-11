import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  'pre-authorized_code': string;

  @IsString()
  @IsOptional()
  tx_code?: string;
}
