export type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: Array<string>;
  grants: {
    'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
      'pre-authorized_code': string;
      tx_code: {
        length: number;
        input_mode: string;
        descreption: string;
      };
    };
  };
};

export type Claim = {
  iss: string;
  vct: string;
  name: string;
  birthdate: string;
};

export type CredentialType =
  | 'UniversityDegreeCredential'
  | 'DriverLicenseCredential'
  | 'VaccinationCredential';

export const CREDENTIALS_STORAGE_KEY = '@credentials';

export type Credential = {
  type: CredentialType;
  credential: string;
};

export const CredentialInfoMap: Record<
  CredentialType,
  { label: string; icon: string }
> = {
  UniversityDegreeCredential: { label: 'University Diploma', icon: 'school' },
  DriverLicenseCredential: { label: "Driver's License", icon: 'car' },
  VaccinationCredential: {
    label: 'Vaccination Certificate',
    icon: 'hospital-box',
  },
} as const;
