import { Link, router, Stack } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { useVerifyMetadataMutation } from '@/queries';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

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
    console.log('verifyRequestUri', verifyRequestUri);
    verifyMetadataMutate(undefined, {
      onSuccess: (data) => {
        console.log('verify metadata', data);

        router.navigate({
          pathname: '/Verify/SelectCredential',
        });
      },
      onError: (error) => {
        console.error('Error fetching verify metadata:', error);
      },
    });

    router.navigate({
      pathname: '/Verify/SelectCredential',
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
        <CameraView
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {permission && !permission.granted && (
          <ActivityIndicator
            color={'white'}
            size="large"
            style={{ position: 'absolute' }}
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.overlaySection} />
          <View style={styles.centerRow}>
            <View style={styles.overlaySection} />
            <View style={styles.scanArea} />
            <View style={styles.overlaySection} />
          </View>
          <View style={styles.overlayTextSection}>
            <Text style={styles.overlayText}>Scan a QR code</Text>
          </View>
          <View style={styles.overlaySection} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayTextSection: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    color: 'white',
  },
  overlayText: {
    color: 'white',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
  },
  centerRow: {
    flexDirection: 'row',
    height: 250,
  },
  centerSection: {
    width: 250,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
