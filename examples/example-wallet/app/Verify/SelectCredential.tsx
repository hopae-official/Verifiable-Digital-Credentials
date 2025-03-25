import { router, Stack } from 'expo-router';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useRef } from 'react';
import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CredentialDecoder } from '@vdcs/wallet';
import { Claim } from '@/types';
import { Button } from '@/components/ui/button';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { isValidClaim } from '@/utils';
import { useSharedValue } from 'react-native-reanimated';

//@Todo: Remove mock credential
const mockCredential =
  'eyJ0eXAiOiJkYytzZC1qd3QiLCJhbGciOiJFUzI1NiJ9.eyJ2Y3QiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tL2NyZWRlbnRpYWxzL3R5cGVzL3VuaXZlcnNpdHkiLCJpc3MiOiJodHRwczovL2lzc3Vlci5kZXYuaG9wYWUuY29tIiwiX3NkIjpbIllwbm15VzdZemJ0ejFOODZVZjJadGNBNldoM0NVR1cyT0c1SjNFcVozYm8iLCJ0NXdmZE5CMWJuS1Nlcjkybm9QZXZaSW5fMm1MV0F0Q1lDTG1ac0dFR0xNIl0sIl9zZF9hbGciOiJzaGEtMjU2In0.k--1y8ivPJrjX0gD3CA9mZLIkIHs8zJPdohNFYzJ5jdf1736HDkGHgy3pT1hnNXF-vm0GKrwBSmueX3y8pIbtA~WyI5YjQwZjc1ODFiNzY4OGY5IiwibmFtZSIsIkpvaG4gRG9lIl0~WyJjOGZiNDNjNGFjMGMwMDVmIiwiYmlydGhkYXRlIiwiMTk5MC0wMS0wMSJd~';
const mockResponseUri = 'https://verifier.dev.hopae.com/request'; // mock endpoint to present VP

export default function SelectCredentialScreen() {
  const credential = mockCredential;

  const claims: Claim | null = credential
    ? (() => {
        const decoded = CredentialDecoder.decodeSDJWT(credential).claims;
        return isValidClaim<Claim>(decoded, ['iss', 'vct', 'name', 'birthdate'])
          ? decoded
          : null;
      })()
    : null;

  const mockList = ['University Deploma', 'Driving License', 'Passport'];

  const handlePressAccept = () => {
    router.replace({
      pathname: '/Verify/VerifyResult',
      params: { credential },
    });
  };

  const handlePressDeny = () => {
    router.dismissAll();
    router.push({ pathname: '/' });
  };

  const ref = useRef<ICarouselInstance>(null);
  const width = 300;
  const data = mockList;
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* <ThemedView style={styles.container}> */}
        <Text style={styles.title}>
          An organisation is asking for information
        </Text>
        <Text style={{ fontSize: 16 }}>
          Select credential to be presented to
        </Text>
        <Text style={{ fontSize: 16, color: 'darkblue' }}>
          {mockResponseUri}
        </Text>

        <View style={{ width: '100%' }}>
          <Carousel
            ref={ref}
            style={{
              width: '100%',
              height: 220,
              justifyContent: 'center',
            }}
            width={310}
            height={300}
            data={data}
            loop={false}
            onProgressChange={progress}
            snapEnabled={true}
            renderItem={({ index, item }) => (
              <View style={styles.credentialCardWrapper}>
                <Card style={styles.credentialCard}>
                  <ImageBackground
                    source={require('@/assets/images/card_bg.jpg')}
                    style={styles.contentContainer}
                  >
                    <View style={styles.cardContent}>
                      <View style={styles.circleImage}>
                        <Ionicons
                          name="school-outline"
                          size={24}
                          color={'gray'}
                        />
                      </View>
                      <Text style={styles.cardText}>{item}</Text>
                    </View>
                  </ImageBackground>
                </Card>
              </View>
            )}
          />

          <Pagination.Basic
            progress={progress}
            data={data}
            dotStyle={{ backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 50 }}
            containerStyle={{ gap: 5, marginTop: 10 }}
            onPress={onPressPagination}
          />
        </View>
        <Card style={styles.providerCard}>
          <View style={styles.circleImage}>
            <Ionicons name="newspaper" size={24} color={'gray'} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.boldText}>ABC Bank</Text>
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingTop: 20,
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
  credentialCardWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  credentialCard: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    overflow: 'hidden',
    marginTop: 10,
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
    bottom: 10,
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
    margin: 3,
  },
  providerCard: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 20,
  },
  verifiedDescWapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 3,
  },
  decsText: {
    color: 'green',
  },
  dataInfoContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  dataInfoCard: {
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
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
  infoLabelText: {
    fontSize: 15,
    opacity: 0.5,
  },
  infoText: {
    fontSize: 15,
    opacity: 0.7,
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
  buttonWrapper: {
    marginVertical: 30,
    width: '90%',
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
