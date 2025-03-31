import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useCredentialOfferQuery } from '@/queries';
import { useEffect } from 'react';

// Todo: Remove this mock URI
const mockCredentialOfferUri = 'https://issuer.dev.hopae.com/credential-offer';

export default function CredentialOfferScreen() {
  const params = useLocalSearchParams<{ credentialOfferUri: string }>();

  const { data, isLoading } = useCredentialOfferQuery({
    credentialOfferUri: mockCredentialOfferUri,
  });

  const preAuthorizedCode =
    data?.grants['urn:ietf:params:oauth:grant-type:pre-authorized_code'][
      'pre-authorized_code'
    ];
  const credentialIssuer = data?.credential_issuer;

  useEffect(() => {
    if (!preAuthorizedCode) return;

    setTimeout(() => {
      router.replace({
        pathname: '/Issue/TokenRequestStep',
        params: { preAuthorizedCode, credentialIssuer },
      });
    }, 1000);
  }, [preAuthorizedCode]);

  //@Todo: Remove useless screen

  return (
    <>
      <Stack.Screen options={{ title: 'Credential Offer Step' }} />
      <ThemedView style={styles.container}>
        <ActivityIndicator
          style={styles.loadingSpinner}
          color={'black'}
          size="large"
        />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  descWrapper: {
    gap: 8,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    height: 400,
    justifyContent: 'center',
  },
  descText: {
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  loadingSpinner: {
    marginTop: 20,
  },
});
