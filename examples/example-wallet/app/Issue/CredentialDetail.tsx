import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

import { CredentialDecoder } from '@vdcs/wallet';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/ui/card';
import { Claim } from '@/types';
import { isValidClaim } from '@/utils';

export default function CredentialDetailScreen() {
  const params = useLocalSearchParams<{ credential: string }>();
  const credential = params.credential;
  const claims: Claim | null = credential
    ? (() => {
        const decoded = CredentialDecoder.decodeSDJWT(credential).claims;
        return isValidClaim<Claim>(decoded, ['iss', 'vct', 'name', 'birthdate'])
          ? decoded
          : null;
      })()
    : null;

  if (!claims) return <Text>No claims</Text>;

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
        }}
      />

      <View style={styles.container}>
        <Card style={styles.credentialCard}>
          <ImageBackground
            source={require('@/assets/images/card_bg.jpg')}
            style={styles.contentContainer}
          >
            <View style={styles.cardContent}>
              <View style={styles.circleImage}>
                <Ionicons name="school-outline" size={24} color={'gray'} />
              </View>
              <Text style={styles.cardText}>University Deploma</Text>
            </View>
          </ImageBackground>
        </Card>

        <View style={styles.dataInfoContainer}>
          <Card style={styles.dataInfoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.infoCircleImage}>
                <Ionicons name="newspaper" size={15} color={'gray'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.boldText}>Information</Text>
              </View>
            </View>

            <Card style={styles.infoWrapper}>
              <View>
                <Text style={styles.infoLabelText}>ISS</Text>
                <Text style={styles.infoText}>{claims.iss}</Text>
              </View>
              <View>
                <Text style={styles.infoLabelText}>VCT</Text>
                <Text style={styles.infoText}>{claims.vct}</Text>
              </View>
              <View>
                <Text style={styles.infoLabelText}>Name</Text>
                <Text style={styles.infoText}>{claims.name}</Text>
              </View>
              <View>
                <Text style={styles.infoLabelText}>Birthdate</Text>
                <Text style={styles.infoText}>{claims.birthdate}</Text>
              </View>
            </Card>
          </Card>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  credentialCard: {
    marginTop: 20,
    width: '95%',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    overflow: 'hidden',
  },
  contentContainer: {
    backgroundColor: 'transparent',
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
    fontSize: 18,
    position: 'absolute',
    bottom: 15,
    right: 15,
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
    margin: 3,
  },
  infoCircleImage: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    backgroundColor: 'white',
    marginRight: 4,
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
    backgroundColor: 'white',
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
    width: '100%',
    gap: 15,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoLabelText: {
    fontSize: 15,
    opacity: 0.5,
  },
  infoText: {
    fontSize: 15,
    opacity: 0.7,
  },
});
