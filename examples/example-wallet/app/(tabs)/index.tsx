import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';

import { useState, useCallback } from 'react';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CREDENTIALS_STORAGE_KEY,
  Credential,
  CredentialInfoMap,
} from '@/types';

const mockCredential =
  'eyJ0eXAiOiJkYytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJ2Y3QiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tL2NyZWRlbnRpYWxzL3R5cGVzL3VuaXZlcnNpdHkiLCJpc3MiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tIiwiX3NkIjpbIllwbm15VzdZemJ0ejFOODZVZjJadGNBNldoM0NVR1cyT0c1SjNFcVozYm8iLCJ0NXdmZE5CMWJuS1Nlcjkybm9QZXZaSW5fMm1MV0F0Q1lDTG1ac0dFR0xNIl0sIl9zZF9hbGciOiJzaGEtMjU2In0.k--1y8ivPJrjX0gD3CA9mZLIkIHs8zJPdohNFYzJ5jdf1736HDkGHgy3pT1hnNXF-vm0GKrwBSmueX3y8pIbtA~WyI5YjQwZjc1ODFiNzY4OGY5IiwibmFtZSIsIkpvaG4gRG9lIl0~WyJjOGZiNDNjNGFjMGMwMDVmIiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~';

type IconName = 'school' | 'car' | 'hospital-box' | 'wallet';

type Card = {
  id: number;
  title: string;
  icon: IconName;
};

const sampleCards: Card[] = [
  { id: 1, title: 'University Diploma', icon: 'school' },
  { id: 2, title: 'Driver License', icon: 'car' },
  { id: 3, title: 'Health Insurance', icon: 'hospital-box' },
];

export default function HomeScreen() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  console.log('credentials', credentials);
  useFocusEffect(
    useCallback(() => {
      const loadCredentials = async () => {
        const storedCredentials = await AsyncStorage.getItem(
          CREDENTIALS_STORAGE_KEY,
        );
        console.log('stored credentials:', storedCredentials);
        setCredentials(storedCredentials ? JSON.parse(storedCredentials) : []);
      };

      loadCredentials();
    }, []),
  );

  const handlePressCredential = (credential: Credential) => {
    router.navigate({
      pathname: '/Issue/CredentialDetail',
      params: { credential: credential.credential, type: credential.type },
    });
  };

  const handlePressAddCredential = () => {
    router.navigate({
      pathname: '/Issue/CredentialTypeSelection',
    });
  };

  //const credentials: Card[] = credential ? sampleCards : [];

  const card = sampleCards[0];
  return (
    <SafeAreaView style={styles.container}>
      {credentials.length > 0 ? (
        <View style={styles.listContainer}>
          <TouchableOpacity
            style={styles.addCredentialButton}
            onPress={handlePressAddCredential}
          >
            <Ionicons size={25} name="add" color={'white'} />
          </TouchableOpacity>

          <View style={styles.stackContainer}>
            {credentials.map((credential, index) => (
              <TouchableHighlight
                key={index}
                underlayColor={'transparent'}
                style={[
                  styles.cardWrapper,
                  {
                    top: index * CARD_OFFSET,
                    zIndex: sampleCards.length + index,
                  },
                ]}
                onPress={() => handlePressCredential(credential)}
              >
                <Card style={styles.credentialCard}>
                  <ImageBackground
                    source={require('@/assets/images/card_bg.jpg')}
                    style={styles.contentContainer}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.circleImage}>
                        <Ionicons size={28} name="wallet-outline" />
                      </View>
                      <Text style={styles.cardText}>
                        {CredentialInfoMap[credential.type]?.label}
                      </Text>
                    </View>
                  </ImageBackground>
                </Card>
              </TouchableHighlight>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons size={80} name="wallet-outline" />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 20,
              padding: 20,
            }}
          >
            Welcome
          </Text>
          <Text style={{ fontSize: 13, color: 'gray', textAlign: 'center' }}>
            You don't have any credentials yet. To add your first credential,
            tap the button
          </Text>
          <Button
            variant="default"
            className="w-full shadow shadow-foreground/5 mt-5"
            style={{ width: '100%', backgroundColor: Colors.light.orange }}
            onPress={() => router.navigate('/Issue/CredentialTypeSelection')}
          >
            <Text style={{ color: 'white' }}>Add a credential</Text>
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const CARD_OFFSET = 53;
const CARD_WIDTH = 350;
const CARD_HEIGHT = CARD_WIDTH / 1.58;

const styles = StyleSheet.create({
  addCredentialButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.orange,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.light.lightBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  stackContainer: {
    width: CARD_WIDTH,
    position: 'relative',
    marginTop: 100,
  },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  qrButton: {
    alignSelf: 'flex-end',
    marginRight: 10,
    backgroundColor: 'blue',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  credentialCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    overflow: 'hidden',
  },
  contentContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
  },
  cardContent: {
    padding: 10,
    flex: 1,
  },
  cardText: {
    color: 'white',
    fontSize: 15,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
  },
});
