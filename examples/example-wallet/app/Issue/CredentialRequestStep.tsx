import { router, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useCredentialRequestMutation } from '@/queries';
import { useEffect, useState } from 'react';

export default function CredentialRequestStepScreen() {
  const [credential, setCredential] = useState<string | null>(null);

  const { mutate: credentialRequestMutate, isPending } =
    useCredentialRequestMutation({
      onSuccess: (data) => {
        const credential = data.credentials[0].credential;

        if (!credential) return;

        setCredential(credential);
      },
    });

  useEffect(() => {
    // @Description: Request credential
    // @Reference: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-pre-authorized-code-flow (Step 5)
    credentialRequestMutate();
  }, []);

  useEffect(() => {
    if (!credential) return;

    router.replace({ pathname: '/', params: { credential } });
  }, [credential]);

  return (
    <>
      <Stack.Screen options={{ title: 'Credential Request Step' }} />
      <ThemedView style={styles.container}>
        {isPending && (
          <>
            <Text>Fetching Credential...</Text>
            <ActivityIndicator
              style={styles.loadingSpinner}
              color={'black'}
              size="large"
            />
          </>
        )}
        {credential && (
          <>
            <Text style={styles.title}>Credential Request Success</Text>
            <View style={styles.descWrapper}>
              <Text style={styles.boldText}>credential</Text>
              <Text style={styles.text}>{credential}</Text>
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
    alignItems: 'center',
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
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
