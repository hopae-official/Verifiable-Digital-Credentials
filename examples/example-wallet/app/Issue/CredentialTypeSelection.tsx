import { router, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/Colors';

const mockCredentialOfferUri = 'https://issuer.dev.hopae.com/credential-offer';

export default function CredentialTypeSelectionScreen() {
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
        <Text style={styles.descText}>Select credential</Text>

        <TouchableOpacity
          onPress={() => {
            router.replace({
              pathname: '/Issue/CredentialOffer',
              params: { credentialOfferUri: mockCredentialOfferUri },
            });
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  descText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  credentialTypeCard: {
    padding: 12,
    marginTop: 15,
    backgroundColor: Colors.light.background,
    borderColor: Colors.light.border,
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
