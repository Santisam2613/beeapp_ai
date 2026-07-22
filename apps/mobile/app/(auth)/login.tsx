import React, { useState } from 'react';
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Top Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../src/assets/logoletras.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
              <Text style={styles.title}>Inicia Sesión</Text>
              <Text style={styles.subtitle}>
                Ingresa tu número celular para acceder a tu espacio de trabajo.
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
                    placeholderTextColor="#ADB5BD"
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
                onPress={handleContinue}
              >
                <Text style={styles.primaryButtonText}>Continuar</Text>
              </TouchableOpacity>

              {/* Toggle to Register */}
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>¿No tienes cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                  <Text style={styles.toggleLink}>Regístrate</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F8F9FC',
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
    marginTop: Platform.OS === 'android' ? 24 : 12,
    marginBottom: 8,
  },
  logo: {
    width: 220,
    height: 70,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#6025d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
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
    backgroundColor: '#F1F3F5',
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
    color: '#1A1A2E',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
    paddingVertical: 8,
    letterSpacing: 1,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#6025d2',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6025d2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#6C757D',
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6025d2',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  footerNotice: {
    fontSize: 12,
    color: '#ADB5BD',
    marginBottom: 4,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6025d2',
  },
  footerDot: {
    fontSize: 12,
    color: '#ADB5BD',
  },
});
