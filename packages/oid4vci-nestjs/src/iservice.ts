export abstract class CredentialProvider {
  abstract issueCredential(): Promise<void>; // TODO: implement
}
