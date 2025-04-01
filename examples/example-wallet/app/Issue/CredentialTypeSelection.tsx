import { router, Stack } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card } from '@/components/ui/card';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Separator } from '@/components/ui/separator';
import { Colors } from '@/constants/Colors';
import { CredentialType } from '@/types';

const mockCredentialOfferUri = 'https://issuer.dev.hopae.com/credential-offer';

export default function CredentialTypeSelectionScreen() {
  const handlePressCredential = (credentialType: CredentialType) => {
    router.replace({
      pathname: '/Issue/CredentialRequestStep',
      params: { credentialType },
    });
  };

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
          animation: 'none',
        }}
      />
      <View style={styles.container}>
        <Text style={styles.descText}>Select credential</Text>

        <TouchableOpacity
          onPress={() => {
            handlePressCredential('UniversityDegreeCredential');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>University Diploma</Text>
            <Separator className="my-2 bg-gray-300" />
            <View style={styles.techSpecTextWrapper}>
              <Text style={styles.credentialSpecText}>OpenID</Text>
              <Text style={styles.credentialSpecText}>SD-JWT</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handlePressCredential('DriverLicenseCredential');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>Driver's Lisence</Text>
            <Separator className="my-3 bg-gray-300" />
            <View style={styles.techSpecTextWrapper}>
              <Text style={styles.credentialSpecText}>mDL</Text>
              <Text style={styles.credentialSpecText}>SD-JWT</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            handlePressCredential('VaccinationCredential');
          }}
        >
          <Card style={styles.credentialTypeCard} className="shadow-sm">
            <Text style={styles.credentialTypeText}>
              Vaccination Certificate
            </Text>
            <Separator className="my-3 bg-gray-300" />
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
