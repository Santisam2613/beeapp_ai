import React, { useEffect, useRef } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';

declare const require: any;

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation for logo and texts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Show custom splash for 2.5 seconds, then navigate to login
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={require('../src/assets/logoletras.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <ActivityIndicator size="large" color="#FFFFFF" style={styles.spinner} />

        <Text style={styles.title}>Iniciando tu espacio seguro...</Text>
        <Text style={styles.subtitle}>Todo lo importante, en un solo lugar.</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.primary, // #6025d2
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 280,
    height: 120,
    marginBottom: 16,
  },
  spinner: {
    marginVertical: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'center',
  },
});
