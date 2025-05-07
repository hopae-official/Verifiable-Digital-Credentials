import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CredentialDto {
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.credential_configuration_id)
  credential_identifier: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.credential_identifier)
  credential_configuration_id: string;

  @IsObject()
  @IsOptional()
  @ValidateIf((o) => o.proofs)
  proof?: {
    proof_type: string;
    jwt?: string;
    ldp_vp?: Record<string, unknown>; // TODO: fix
    attestation?: string;
  };

  @IsObject()
  @IsOptional()
  @ValidateIf((o) => o.proof)
  proofs?: {
    jwt?: Array<string>;
    ldp_vp?: Array<Record<string, unknown>>; // TODO: fix
    attestation?: Array<string>;
  };

  @IsObject()
  @IsOptional()
  credential_response_encryption?: {
    jwk: string;
    alg: string;
    enc: string;
  };
}
