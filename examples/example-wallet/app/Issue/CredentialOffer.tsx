import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useCredentialOfferQuery } from '@/queries';
import { useEffect } from 'react';

export default function CredentialOfferScreen() {
  const params = useLocalSearchParams<{ credentialOfferUri: string }>();

  const { data, isLoading } = useCredentialOfferQuery({
    credentialOfferUri: params.credentialOfferUri,
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
  return (
    <>
      <Stack.Screen options={{ title: 'Credential Offer Step' }} />
      <ThemedView style={styles.container}>
        {isLoading && (
          <>
            <Text>Credential Offer Step</Text>
            <ActivityIndicator
              style={styles.loadingSpinner}
              color={'black'}
              size="large"
            />
          </>
        )}
        {data && (
          <>
            <Text style={styles.title}>Credential Offer Res</Text>
            <View style={styles.descWrapper}>
              <Text style={styles.descText}>
                pre-authorized_code: {preAuthorizedCode}
              </Text>
              <Text style={styles.descText}>
                Credential Issuer: {credentialIssuer}
              </Text>
            </View>
          </>
        )}
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
