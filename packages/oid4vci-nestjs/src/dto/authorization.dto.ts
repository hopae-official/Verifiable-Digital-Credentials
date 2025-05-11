import {
  IsString,
  IsOptional,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';

import { AuthorizationDetails } from '../types/authorization';

export class AuthorizationRequestDto {
  @IsString()
  response_type: string;

  @IsString()
  client_id: string;

  @IsUrl()
  redirect_uri: string;

  @IsString()
  @IsOptional()
  scope: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  nonce?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  authorization_details?: AuthorizationDetails[];
}
