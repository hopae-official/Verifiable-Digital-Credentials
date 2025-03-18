import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTestQuery } from '@/queries';

export default function HomeScreen() {
  const { isPending, error, data } = useTestQuery();
  const params = useLocalSearchParams<{ credential: string }>();
  const credential = params.credential;

  if (isPending) return <Text>'Loading...'</Text>;

  if (error) return <Text>'An error has occurred: ' + error.message</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.navigate('/Issue/QR')}
        style={styles.qrButton}
      >
        <View>
          <Text style={styles.buttonText}>QR</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        {credential ? (
          <View style={styles.credentialWrapper}>
            <Text style={styles.title}>My Credential</Text>
            <Text>{credential}</Text>
          </View>
        ) : (
          <ThemedText>You don't have any credentials yet</ThemedText>
        )}
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
