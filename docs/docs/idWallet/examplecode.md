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

```

## Present Credential

```ts

```
