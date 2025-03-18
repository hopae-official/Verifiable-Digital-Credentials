import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTestQuery } from '@/queries';

export default function HomeScreen() {
  const { isPending, error, data } = useTestQuery();

  if (isPending) return <Text>'Loading...'</Text>;

  if (error) return <Text>'An error has occurred: ' + error.message</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.navigate('/Issue/QR')}
        style={styles.qrButton}
      >
        <View>
          <Text>QR</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <ThemedText>Credentials list</ThemedText>
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
    backgroundColor: 'gray',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
