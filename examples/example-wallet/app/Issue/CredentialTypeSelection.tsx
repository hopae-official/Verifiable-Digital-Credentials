import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

import { Card } from '@/components/ui/card';

export default function CredentialTypeSelectionScreen() {

  return (
    <>
      <Stack.Screen options={{ title: 'Credential Type Selection' }} />
      <ThemedView style={styles.container}>
        <Text style={styles.descText}>
          Select the type of credential to be issued
        </Text>
        <Card
          style={{
            width: 350,
            marginTop: 20,
            gap: 10,
            padding: 10,
            backgroundColor: 'lightgray',
          }}
        >
          <TouchableOpacity>
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>University Deploma</Text>
              <Text style={styles.credentialLabelText}>{'>'}</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity>
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>Driver's Lisense</Text>
              <Text style={styles.credentialLabelText}>{'>'}</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity>
            <Card style={styles.credentialLabel}>
              <Text style={styles.credentialLabelText}>
                Resident Registration Card
              </Text>
              <Text style={styles.credentialLabelText}>{'>'}</Text>
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
  },
  descText: {
    fontSize: 17,
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
    fontSize: 16,
  },
});
