import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { useCredentialRequestMutation } from '@/queries';
import { useEffect, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/button';
import { CREDENTIALS_STORAGE_KEY, CredentialType } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCredentialClaims } from '@/utils';

export default function CredentialRequestStepScreen() {
  const params = useLocalSearchParams<{ credentialType: CredentialType }>();
  const credentialType = params.credentialType;

  const [credential, setCredential] = useState<string | null>(null);
  const claims = credential
    ? getCredentialClaims({ credential, type: credentialType })
    : null;

  const { mutate: credentialRequestMutate, isPending } =
    useCredentialRequestMutation({
      onSuccess: async (data) => {
        const credential = data.credentials[0].credential;

        if (!credential) return;

        setCredential(credential);
      },
    });

  useEffect(() => {
    // @Description: Request credential
    // @Reference: https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html#name-pre-authorized-code-flow (Step 5)
    credentialRequestMutate({ credentialType });
  }, [credentialType]);

  const handlePressAccept = async () => {
    // Get existing credentials from storage
    const existingCredentials = await AsyncStorage.getItem(
      CREDENTIALS_STORAGE_KEY,
    );
    const credentials = existingCredentials
      ? JSON.parse(existingCredentials)
      : [];

    // Add new credential to array
    credentials.push({ type: credentialType, credential });

    // Save updated credentials array
    await AsyncStorage.setItem(
      CREDENTIALS_STORAGE_KEY,
      JSON.stringify(credentials),
    );

    router.replace({ pathname: '/' });
  };

  const handlePressDeny = () => {
    router.replace({ pathname: '/' });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={27} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {isPending && (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Fetching Credential...</Text>
            <ActivityIndicator
              style={styles.loadingSpinner}
              color={'black'}
              size="large"
            />
          </View>
        )}
        {credential && !!claims && (
          <>
            <Text style={styles.title}>
              Would you like to add the credentials?
            </Text>
            <Card style={styles.providerCard}>
              <View style={styles.circleImage}>
                <Ionicons name="newspaper" size={24} color={'gray'} />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.boldText}>Hopae Inc.</Text>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color={'green'}
                />
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
                  {Object.entries(claims).map(([key, value]) => (
                    <View key={key}>
                      <Text style={styles.infoLabelText}>
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </Text>
                      <Text style={styles.infoText}>{value}</Text>
                    </View>
                  ))}
                </Card>
              </Card>
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                variant={'default'}
                style={styles.acceptButton}
                onPress={handlePressAccept}
              >
                <Text style={styles.acceptButtonText}>Add</Text>
              </Button>
              <Button
                variant={'default'}
                style={styles.denyButton}
                onPress={handlePressDeny}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    paddingTop: 30,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginStart: 10,
  },
  providerCard: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.border,
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
    backgroundColor: Colors.light.lightYellow,
    borderColor: Colors.light.border,
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
    borderColor: 'transparent',
    borderRadius: 5,
    width: '95%',
    gap: 7,
    backgroundColor: Colors.light.background,
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
    backgroundColor: Colors.light.orange,
  },
  acceptButtonText: {
    color: 'white',
  },
  denyButton: {
    borderWidth: 1,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  infoLabelText: {
    fontSize: 15,
    opacity: 0.5,
  },
});
