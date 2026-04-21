import React from 'react';
import { StyleSheet, View } from 'react-native';
import InternablyLogo from '../shared/InternablyLogo';

export default function SplashScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.logoFrame}>
        <InternablyLogo compact light withIcon />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFrame: {
    width: 220,
    transform: [{ scale: 0.9 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
