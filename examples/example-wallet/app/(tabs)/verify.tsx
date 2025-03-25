import { Link, router, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { useVerifyMetadataMutation } from '@/queries';

export default function VerifyQRScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifyRequestUri, setVerifyRequestUri] = useState('');

  const { mutate: verifyMetadataMutate } = useVerifyMetadataMutation();

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!verifyRequestUri) return;

    verifyMetadataMutate(undefined, {
      onSuccess: (data) => {
        console.log('vefiry metadata', data);

        router.navigate({
          pathname: '/Verify/SelectCredential',
        });
      },
    });
  }, [verifyRequestUri, verifyMetadataMutate]);

  const handleBarcodeScanned = useCallback(
    async (event: { data: string; type: string }) => {
      if (scanned) return;

      setScanned(true);

      const uri = event.data;
      const regex = /request_uri=([^&]*)/;
      const match = uri.match(regex);

      //@Todo: check server uri

      if (match && match[1]) {
        const decodedUri = decodeURIComponent(match[1]);

        console.log('추출한 디코딩된 URI:', decodedUri);

        setVerifyRequestUri(decodedUri);
      } else {
        console.error('credential_offer_uri를 찾을 수 없습니다.');
      }
    },
    [scanned],
  );
  return (
    <>
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
