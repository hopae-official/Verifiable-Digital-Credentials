import { router, Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useTokenRequestMutation } from '@/queries';
import { useEffect, useState } from 'react';

export default function TokenRequestStepScreen() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { mutate: tokenRequestMutate, isPending } = useTokenRequestMutation({
    onSuccess: (data) => {
      if (!data.access_token) return;

      setAccessToken(data.access_token);

      router.replace({ pathname: '/Issue/CredentialRequestStep' });
    },
  });

  useEffect(() => {
    // @Description: Request access token
    // @Reference: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-pre-authorized-code-flow (Step 4)
    tokenRequestMutate();
  }, []);

  //@Todo: Remove useless screen

  return (
    <>
      <Stack.Screen options={{ title: 'Token Request Step' }} />
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
