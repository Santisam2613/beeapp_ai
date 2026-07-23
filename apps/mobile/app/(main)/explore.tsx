import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@beeapp/design-system';
import { Compass, Mail, FileText, Folder, Calendar, Phone, Users } from 'lucide-react-native';
import FloatingTabBar from '../../src/components/FloatingTabBar';

export default function ExploreScreen() {
  const params = useLocalSearchParams();
  const section = params.section as string;

  // Map section key to readable name and icon
  const sectionDetails: Record<string, { name: string; icon: React.ReactNode }> = {
    mail: {
      name: 'Correo Unificado',
      icon: <Mail size={40} color={colors.brand.primary} />,
    },
    notes: {
      name: 'Notas y Pendientes',
      icon: <FileText size={40} color={colors.brand.primary} />,
    },
    files: {
      name: 'Archivos y Documentos',
      icon: <Folder size={40} color={colors.brand.primary} />,
    },
    calendar: {
      name: 'Calendario y Eventos',
      icon: <Calendar size={40} color={colors.brand.primary} />,
    },
    calls: {
      name: 'Llamadas de Voz y Video',
      icon: <Phone size={40} color={colors.brand.primary} />,
    },
    contacts: {
      name: 'Contactos y Equipos',
      icon: <Users size={40} color={colors.brand.primary} />,
    },
  };

  const currentSection = sectionDetails[section] || {
    name: 'Explora',
    icon: <Compass size={40} color={colors.brand.primary} />,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          {currentSection.icon}
        </View>
        <Text style={styles.title}>{currentSection.name}</Text>
        <Text style={styles.subtitle}>
          {section
            ? `Sección específica cargada mediante parámetro: "${section}". Aquí se integrará el detalle de la función.`
            : 'Busca integraciones, servicios externos y potencia tu espacio de trabajo.'}
        </Text>
        <Text style={styles.placeholderText}>Funcionalidad en desarrollo</Text>
      </View>
      <FloatingTabBar activeTab="explore" />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  placeholderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray500,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
