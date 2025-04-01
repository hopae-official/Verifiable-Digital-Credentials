import { router, Stack, useFocusEffect } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useVerifyMetadataMutation } from '@/queries';
import Ionicons from '@expo/vector-icons/Ionicons';

const SCAN_AREA_SIZE = { width: 250, height: 250 };

export default function VerifyQRScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [verifyRequestUri, setVerifyRequestUri] = useState('');

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setVerifyRequestUri('');
    }, []),
  );

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  useEffect(() => {
    if (!verifyRequestUri) return;

    // @Description: After parsing verifyRequestUri, navigate to SelectCredential screen and then fetch verifyRequestUri
    router.navigate({
      pathname: '/Verify/SelectCredential',
      params: { verifyRequestUri },
    });
  }, [verifyRequestUri]);

  const handleBarcodeScanned = useCallback(
    async (event: {
      data: string;
      type: string;
      bounds: { origin: { x: number; y: number } };
    }) => {
      if (scanned) return;

      // 화면 중앙의 스캔 영역 계산
      const screenWidth = Dimensions.get('window').width;
      const screenHeight = Dimensions.get('window').height;

      const scanArea = {
        x: (screenWidth - SCAN_AREA_SIZE.width) / 2,
        y: (screenHeight - SCAN_AREA_SIZE.height) / 2,
        width: SCAN_AREA_SIZE.width,
        height: SCAN_AREA_SIZE.height,
      };

      // QR 코드가 스캔 영역 내에 있는지 확인
      const { x, y } = event.bounds.origin;
      const isInScanArea =
        x >= scanArea.x &&
        x <= scanArea.x + scanArea.width &&
        y >= scanArea.y &&
        y <= scanArea.y + scanArea.height;

      if (!isInScanArea) return;

      setScanned(true);

      const uri = event.data;

      console.log('Scanned URI:', uri);
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
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={30} color="white" />
          </TouchableOpacity>
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
      </SafeAreaView>
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
  closeButton: {
    marginTop: 50,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    padding: 18,
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
    width: SCAN_AREA_SIZE.width,
    height: SCAN_AREA_SIZE.height,
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'white',
    borderWidth: 1,
  },
  centerRow: {
    flexDirection: 'row',
    height: SCAN_AREA_SIZE.height,
  },
  centerSection: {
    width: SCAN_AREA_SIZE.width,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
