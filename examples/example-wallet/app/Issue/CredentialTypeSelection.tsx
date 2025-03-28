import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';
import { Separator } from '@/components/ui/separator';

export default function CredentialTypeSelectionScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          //headerBackTitle: 'Back',
          //headerTitle: () => null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
          ),
        }}
      />
      <ThemedView style={styles.container}>
        <Text style={styles.descText}>Select credential</Text>

        <TouchableOpacity
          onPress={() => {
            router.navigate('/Issue/QR');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>University Diploma</Text>
            <Separator className="my-2" />
            <View style={styles.techSpecTextWrapper}>
              <Text style={styles.credentialSpecText}>OpenID</Text>
              <Text style={styles.credentialSpecText}>SD-JWT</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate('/Issue/QR');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>Driver's Lisence</Text>
            <Separator className="my-3" />
            <View style={styles.techSpecTextWrapper}>
              <Text style={styles.credentialSpecText}>mDL</Text>
              <Text style={styles.credentialSpecText}>SD-JWT</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate('/Issue/QR');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>
              Vaccination Certificate
            </Text>
            <Separator className="my-3" />
            <View style={styles.techSpecTextWrapper}>
              <Text style={styles.credentialSpecText}>OpenID</Text>
              <Text style={styles.credentialSpecText}>SD-JWT</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  descText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  loadingSpinner: {
    marginTop: 20,
  },
  credentialLabel: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  credentialLabelText: {
    fontSize: 15,
  },
  credentialTypeCard: {
    padding: 12,
    marginTop: 15,
  },
  credentialTypeText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  credentialSpecText: {
    fontSize: 12,
    color: 'gray',
  },
  techSpecTextWrapper: {
    flexDirection: 'row',
    gap: 5,
  },
});
