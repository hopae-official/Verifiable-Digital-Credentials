export type Credential = {
  credential: string;
};

export type CredentialResponse = {
  credentials: Array<Credential>;
  notification_id?: string;
};
