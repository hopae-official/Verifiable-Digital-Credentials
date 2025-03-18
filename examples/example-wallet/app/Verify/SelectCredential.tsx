import { router, Stack } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useCredentialRequestMutation } from '@/queries';
import { useEffect, useState } from 'react';

//@Todo: Remove mock credential
const mockCredential =
  'eyJ0eXAiOiJkYytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJ2Y3QiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tL2NyZWRlbnRpYWxzL3R5cGVzL3VuaXZlcnNpdHkiLCJpc3MiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tIiwiX3NkIjpbIllwbm15VzdZemJ0ejFOODZVZjJadGNBNldoM0NVR1cyT0c1SjNFcVozYm8iLCJ0NXdmZE5CMWJuS1Nlcjkybm9QZXZaSW5fMm1MV0F0Q1lDTG1ac0dFR0xNIl0sIl9zZF9hbGciOiJzaGEtMjU2In0.k--1y8ivPJrjX0gD3CA9mZLIkIHs8zJPdohNFYzJ5jdf1736HDkGHgy3pT1hnNXF-vm0GKrwBSmueX3y8pIbtA~WyI5YjQwZjc1ODFiNzY4OGY5IiwibmFtZSIsIkpvaG4gRG9lIl0~WyJjOGZiNDNjNGFjMGMwMDVmIiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~';
const mockResponseUri = 'https://verifier.dev.hopae.com/request'; // mock endpoint to present VP

export default function SelectCredentialScreen() {
  const [credential, setCredential] = useState<string | null>(null);

  useEffect(() => {
    if (!credential) return;

    router.replace({
      pathname: '/Verify/VerifyResult',
      params: { credential },
    });
  }, [credential]);

  return (
    <>
      <Stack.Screen options={{ title: 'Select Credential Step' }} />
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Select Credential</Text>
        <Text>Select credential to be presented to</Text>
        <Text>{mockResponseUri}</Text>
        <TouchableOpacity
          onPress={() => {
            setCredential(mockCredential);
          }}
        >
          <View style={styles.credentialWrapper}>
            <Text style={styles.boldText}>University Credential</Text>
            <Text style={styles.text}>{mockCredential}</Text>
          </View>
        </TouchableOpacity>
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
    backgroundColor: 'lightgray',
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
  credentialWrapper: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    gap: 8,
    marginTop: 20,
  },
});
