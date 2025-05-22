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
    cryptoSuites: ['P-256', 'ES256'],
    didMethods: ['did:web', 'did:key'],
    revocationOptions: {
      statusListSupport: true,
      checkFrequency: 'onUse',
    },
    loggingLevel: __DEV__ ? 'debug' : 'error',
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
