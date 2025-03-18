import { Link, router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';

export default function QRScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [credentialOfferUri, setCredentialOfferUri] = useState('');

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!credentialOfferUri) return;

    // Todo: Remove this mock URI
    const mockCredentialOfferUri =
      'https://issuer.dev.hopae.com/credential-offer';

    router.replace({
      pathname: '/Issue/CredentialOffer',
      params: { credentialOfferUri: mockCredentialOfferUri },
    });
  }, [credentialOfferUri]);

  const handleBarcodeScanned = useCallback(
    async (event: { data: string; type: string }) => {
      if (scanned) return;

      setScanned(true);

      const uri = event.data;
      const regex = /credential_offer_uri=([^&]+)/;
      const match = uri.match(regex);

      if (match && match[1]) {
        const decodedUri = decodeURIComponent(match[1]);

        console.log('추출한 디코딩된 URI:', decodedUri);

        setCredentialOfferUri(decodedUri);
      } else {
        console.error('credential_offer_uri를 찾을 수 없습니다.');
      }
    },
    [scanned],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'QR Scan' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">QR Scanner</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Scan QR!</ThemedText>
        </Link>
        <CameraView
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
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
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
