import { router, Stack } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { useCredentialRequestMutation } from '@/queries';
import { useEffect, useState } from 'react';
import { CredentialDecoder } from '@/utils/decoder';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/button';

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

  const handlePressAccept = () => {
    router.replace({ pathname: '/', params: { credential } });
  };

  const handlePressDeny = () => {
    router.replace({ pathname: '/', params: { credential } });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
          headerShown: !isPending,
        }}
      />
      <>
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
          <ThemedView style={styles.container}>
            <Text style={styles.title}>
              Would you like to accept the credentials?
            </Text>
            <Card style={styles.providerCard}>
              <View style={styles.circleImage}>
                <Ionicons name="newspaper" size={24} color={'gray'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.boldText}>Pid Provider</Text>
                <View style={styles.verifiedDescWapper}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={'green'}
                  />
                  <Text style={styles.decsText}>Contact is verified</Text>
                </View>
              </View>
              <Ionicons name="chevron-down" size={24} />
            </Card>
            <View style={styles.dataInfoContainer}>
              <Card style={styles.dataInfoCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.circleImage}>
                    <Ionicons name="newspaper" size={24} color={'gray'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.boldText}>
                      Personal Identification Data
                    </Text>
                  </View>
                </View>

                <Card style={styles.infoWrapper}>
                  <Text style={styles.infoText}>Family Name</Text>
                  <Text style={styles.infoText}>Given Name</Text>
                  <Text style={styles.infoText}>Birthdate</Text>
                </Card>
              </Card>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                variant={'default'}
                style={styles.acceptButton}
                onPress={handlePressAccept}
              >
                <Text style={styles.acceptButtonText}>Accept</Text>
              </Button>
              <Button
                variant={'default'}
                style={styles.denyButton}
                onPress={handlePressDeny}
              >
                <Text>Deny</Text>
              </Button>
            </View>
          </ThemedView>
        )}
      </>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  providerCard: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
  },
  verifiedDescWapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 3,
  },
  dataInfoContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  dataInfoCard: {
    marginTop: 10,
    width: '95%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.light.lightBlue,
  },
  decsText: {
    color: 'green',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoWrapper: {
    padding: 10,
    borderRadius: 5,
    width: '95%',
    gap: 7,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 15,
    opacity: 0.7,
  },
  loadingSpinner: {
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 30,
    width: '100%',
    padding: 10,
    gap: 5,
  },
  acceptButton: {
    backgroundColor: 'darkblue',
  },
  acceptButtonText: {
    color: 'white',
  },
  denyButton: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
});
