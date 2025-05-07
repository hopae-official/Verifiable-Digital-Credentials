export type CredentialResponse =
  | {
      credentials: Array<{ credential: string | Record<string, unknown> }>;
      notification_id?: string;
    }
  | {
      transaction_id: string;
      notification_id?: string;
    };
