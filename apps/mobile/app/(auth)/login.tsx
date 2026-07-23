import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';

declare const require: any;

export default function LoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setError('Ingresa un número celular válido de 10 dígitos.');
      return;
    }
    setError('');
    router.push({
      pathname: '/(auth)/verify',
      params: { from: 'login', phone: `+57 ${cleaned}` },
    });
  };

  // TEMPORAL DEVELOPMENT BYPASS: Double tap skips OTP & Onboarding directly to main dashboard
  // Single tap proceeds to verify OTP and onboarding account setup.
  // TODO: Remove this shortcut when real auth verification/user checking flow is implemented.
  const lastTap = useRef<number>(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handlePress = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      router.replace('/(main)');
    } else {
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
      }
      tapTimeout.current = setTimeout(() => {
        handleContinue();
        tapTimeout.current = null;
      }, DOUBLE_TAP_DELAY);
    }
    lastTap.current = now;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Main Content Container */}
            <View style={styles.contentContainer}>
              {/* Circular Logo, larger and closer to the title */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('../../src/assets/logo.png')}
                  style={styles.logo}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.title}>Inicia Sesión</Text>
              <Text style={styles.subtitle}>
                Ingresa tu número celular para continuar.
              </Text>

              {/* Phone Input Box */}
              <View style={styles.inputCard}>
                <Text style={styles.inputLabel}>Número Telefónico (Colombia)</Text>
                <View style={styles.phoneInputContainer}>
                  {/* Fixed Prefix with Flag */}
                  <View style={styles.prefixBadge}>
                    <Text style={styles.flag}>🇨🇴</Text>
                    <Text style={styles.prefixText}>+57</Text>
                  </View>

                  {/* Editable Phone Field */}
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="300 000 0000"
                    placeholderTextColor={colors.neutral.gray500}
                    keyboardType="number-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text.replace(/\D/g, ''));
                      if (error) setError('');
                    }}
                  />
                </View>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

              {/* Continue Button */}
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handlePress}
              >
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>

            {/* Legal Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerNotice}>
                Al continuar, aceptas nuestros{' '}
              </Text>
              <View style={styles.footerLinksRow}>
                <TouchableOpacity onPress={() => router.push('/(auth)/terms')}>
                  <Text style={styles.footerLink}>Términos y Condiciones</Text>
                </TouchableOpacity>
                <Text style={styles.footerDot}> • </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/privacy')}>
                  <Text style={styles.footerLink}>Política de Privacidad</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.neutral.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  inputCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray100,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  flag: {
    fontSize: 16,
    marginRight: 6,
  },
  prefixText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.text,
    paddingVertical: 8,
    letterSpacing: 1,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  footerNotice: {
    fontSize: 12,
    color: colors.neutral.gray500,
    marginBottom: 4,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  footerDot: {
    fontSize: 12,
    color: colors.neutral.gray500,
  },
});
