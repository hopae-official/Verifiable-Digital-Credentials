import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CredentialOfferScreen() {
  const params = useLocalSearchParams<{ credentialOfferUri: string }>();
  console.log('params', params.credentialOfferUri);

  return (
    <>
      <Stack.Screen options={{ title: 'Credential Offer Step' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Credential Offer Step</ThemedText>
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
