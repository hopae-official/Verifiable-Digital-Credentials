---
sidebar_position: 2
---

# Example Code

## Init Wallet

```ts
/**
 * Initialize the SDK with configuration options
 */
export const initializeSDK = async () => {
  // Set up secure storage based on platform
  const secureStorageProvider = Platform.select({
    ios: 'keychain',
    android: 'keystore',
    storage: 'secureStore',
  });

  // Initialize the SDK with configuration
  const wallet = await IDWalletSDK.initialize({
    storageProvider: secureStorageProvider,
    cryptoSuites: ['ES256'],
    didMethods: ['did:web'],
    revocationOptions: {
      statusListSupport: true,
      checkFrequency: 'onUse',
    },
    loggingLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
  });

  return wallet;
};
```

## Issue Credential

```ts
export const issueCredential = async (credentialOfferData: string) => {
  const oid4vciSession = await wallet.startIssue(credentialOfferData);

  const status = oid4vciSession.getStatus();

  /**
   * {
   *   status: 'pre-authorized',
   *   tx_code: { input_mode, length, description }
   * }
   *
   */

  const credential = await oid4vciSession.issue({
    credential_configuration_id,
    tx_code,
    proof,
  });

  return credential;
};
```

## Present Credential

```ts
export const presentCredential = async (credentialRequestData: string) => {
  const oid4vpSession = await wallet.startPresent(credentialRequestData);

  const matchedCredentials = oid4vpSession.getMatchedCredentials(credentials);

  // select credentials from matchedCredentials
  const selectedCredential = matchedCredentials[0];

  const selectedPresentations = wallet.selectCredentials(matchedCredential, {
    sd: {
      /* selective disclosure on claims */
    },
    kb: wallet.kb(privateKey),
  });

  const result = await oid4vpSession.present({
    selectedPresentations,
  });

  return result;
};
```
