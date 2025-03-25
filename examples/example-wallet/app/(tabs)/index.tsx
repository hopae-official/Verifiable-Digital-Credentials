import {
  ImageBackground,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ credential: string }>();
  const credential = params.credential;

  const handlePressCredential = () => {
    router.navigate({
      pathname: '/Issue/CredentialDetail',
      params: { credential },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listContainer}>
        {credential ? (
          <TouchableOpacity onPress={handlePressCredential}>
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
          </TouchableOpacity>
        ) : (
          <>
            <Ionicons name="wallet-outline" size={100} color="black" />
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
          </>
        )}

        <Card style={{ width: 300, marginTop: 20 }}>
          <Button
            variant="default"
            className="w-full shadow shadow-foreground/5"
            style={{ width: '100%', backgroundColor: 'darkblue' }}
            onPress={() => router.navigate('/Issue/CredentialTypeSelection')}
          >
            <Text style={{ color: 'white' }}>Add a credential</Text>
          </Button>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.55,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  cardTextWrapper: {},
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
});
