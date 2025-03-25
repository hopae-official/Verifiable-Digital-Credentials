import { router, Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { ThemedView } from '@/components/ThemedView';
import { useEffect } from 'react';

export default function VerifyResultScreen() {
  useEffect(() => {
    setTimeout(() => {
      router.dismissAll();
      router.push({ pathname: '/' });
    }, 5000);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ThemedView style={styles.container}>
        <Text style={styles.title}>Verify Success!</Text>
        <LottieView
          speed={0.8}
          style={{ width: 64, height: 64 }}
          autoPlay={true}
          loop={false}
          source={require('@/assets/lotties/check.json')}
        />
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
