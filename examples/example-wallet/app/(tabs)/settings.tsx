import { StyleSheet, View, Text, Alert } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CREDENTIALS_STORAGE_KEY } from '@/types';

export default function SettingsScreen() {
  const handlePressReset = () => {
    Alert.alert(
      'Reset credentials',
      'Are you sure you want to reset your credentials?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.removeItem(CREDENTIALS_STORAGE_KEY);
          },
        },
      ],
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Button
          variant={'default'}
          onPress={handlePressReset}
          style={{ backgroundColor: Colors.light.orange }}
        >
          <Text style={{ color: 'white'}}>Reset credentials</Text>
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
  },
});
