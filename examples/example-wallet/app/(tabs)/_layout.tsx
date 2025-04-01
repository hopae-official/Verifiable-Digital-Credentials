import '@/global.css';

import { router, Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Wallet',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="wallet-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{ flexDirection: 'row', height: 90, backgroundColor: 'white' }}
    >
      {/* Custom component in the center */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // First half of tabs
          if (index < state.routes.length / 2) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={{ alignItems: 'center' }}
              >
                {options.tabBarIcon({
                  color: isFocused ? Colors.light.orange : 'gray',
                })}
                <Text
                  style={StyleSheet.compose(
                    styles.tabLabelText,
                    isFocused && styles.focusedTabLabelText,
                  )}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>

      {/* Center custom component - for example, a big plus button */}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 5,
          }}
          onPress={() => {
            router.push('/QR');
          }}
        >
          <Ionicons name="qr-code-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Second half of tabs */}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Second half of tabs
          if (index >= state.routes.length / 2) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={{ alignItems: 'center' }}
              >
                {options.tabBarIcon({
                  color: isFocused ? Colors.light.orange : 'gray',
                })}
                <Text
                  style={StyleSheet.compose(
                    styles.tabLabelText,
                    isFocused && styles.focusedTabLabelText,
                  )}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabLabelText: {
    fontSize: 12,
    color: 'gray',
  },
  focusedTabLabelText: {
    fontSize: 12,
    color: Colors.light.orange,
  },
});
