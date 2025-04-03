import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from '@/components/ui/card';
import { CredentialInfoMap, CredentialType } from '@/types';
import { getCredentialClaims } from '@/utils';
import { Colors } from '@/constants/Colors';

export default function CredentialDetailScreen() {
  const params = useLocalSearchParams<{
    credential: string;
    type: CredentialType;
  }>();
  const credential = params.credential;
  const credentialType = params.type;

  const claims = getCredentialClaims({ credential, type: credentialType });

  if (!claims) return <Text>No claims</Text>;

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

      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <Card style={styles.credentialCard}>
          <ImageBackground
            source={require('@/assets/images/card_bg.jpg')}
            style={styles.contentContainer}
          >
            <View style={styles.cardContent}>
              <View style={styles.circleImage}>
                <Ionicons name="school-outline" size={24} color={'gray'} />
              </View>
              <Text style={styles.cardText}>
                {CredentialInfoMap[credentialType]?.label}
              </Text>
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
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    paddingTop: 20,
    paddingBottom: 40,
  },
  credentialCard: {
    //marginTop: 20,
    width: '90%',
    aspectRatio: 1.5,
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
    marginTop: 15,
    width: '90%',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.light.lightYellow,
    borderColor: 'transparent',
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
    backgroundColor: Colors.light.background,
    borderColor: 'transparent',
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
