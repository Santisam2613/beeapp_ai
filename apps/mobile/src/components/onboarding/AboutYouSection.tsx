
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '@beeapp/design-system';
import { Camera } from 'lucide-react-native';
import { sharedStyles as styles, getInitials } from './onboardingShared';

interface AboutYouSectionProps {
  name: string;
  onNameChange: (value: string) => void;
  occupation: string;
  onOccupationChange: (value: string) => void;
  address: string;
  onAddressChange: (value: string) => void;
  hasPhoto: boolean;
  onTogglePhoto: () => void;
}

export default function AboutYouSection({
  name,
  onNameChange,
  occupation,
  onOccupationChange,
  address,
  onAddressChange,
  hasPhoto,
  onTogglePhoto,
}: AboutYouSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionHeader}>Sobre Ti</Text>

      {/* Avatar selection mock */}
      <View style={styles.avatarRow}>
        <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8} onPress={onTogglePhoto}>
          {hasPhoto ? (
            <View style={[styles.avatarCircle, styles.avatarActive]}>
              <Text style={styles.avatarText}>{getInitials(name) || 'YO'}</Text>
              <View style={styles.avatarCheckBadge}>
                <Text style={styles.avatarCheckText}>✓</Text>
              </View>
            </View>
          ) : (
            <View style={styles.avatarCircle}>
              <Camera size={24} color={colors.neutral.gray600} style={{ marginBottom: 4 }} />
              <Text style={styles.avatarPlaceholderText}>Añadir foto</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.avatarInfo}>
          <Text style={styles.avatarInfoTitle}>Foto de Perfil</Text>
          <Text style={styles.avatarInfoDesc}>
            {hasPhoto ? 'Foto cargada (Simulado)' : 'Toca para simular cargar foto (Opcional)'}
          </Text>
        </View>
      </View>

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nombre Completo *</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Ingresa tu nombre y apellido"
          placeholderTextColor={colors.neutral.gray500}
          value={name}
          onChangeText={onNameChange}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>¿A qué te dedicas?</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Ej. Desarrollador, Gerente, Diseñador"
          placeholderTextColor={colors.neutral.gray500}
          value={occupation}
          onChangeText={onOccupationChange}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Ciudad o Dirección</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Ej. Bogotá, Colombia"
          placeholderTextColor={colors.neutral.gray500}
          value={address}
          onChangeText={onAddressChange}
        />
      </View>
    </View>
  );
}
