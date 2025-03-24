import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

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
        <Text style={styles.descText}>
          Select the type of credential to be issued.
        </Text>
        <Card
          style={{
            width: 350,
            marginTop: 20,
            gap: 10,
            padding: 10,
            backgroundColor: Colors.light.lightBlue,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              router.navigate('/Issue/QR');
            }}
          >
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>University Deploma</Text>
              <Ionicons name="add" size={20} color="black" />
            </Card>
          </TouchableOpacity>
          <TouchableOpacity>
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>Driver's Lisense</Text>
              <Ionicons name="add" size={20} color="black" />
            </Card>
          </TouchableOpacity>
          <TouchableOpacity>
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>
                Resident Registration Card
              </Text>
              <Ionicons name="add" size={20} color="black" />
            </Card>
          </TouchableOpacity>
        </Card>
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
});
