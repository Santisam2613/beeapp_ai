import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MainPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>BeeApp AI - Pantalla Principal (Placeholder)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#1A1A2E',
  },
});
