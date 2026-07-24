
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@beeapp/design-system';
import { Sparkles, Calendar, FileText, Mail } from 'lucide-react-native';

interface HomeAssistantCardProps {
  onChipPress: () => void;
}

export default function HomeAssistantCard({ onChipPress }: HomeAssistantCardProps) {
  return (
    <View style={styles.aiCard}>
      <View style={styles.aiCardHeader}>
        <View style={styles.aiCardBadge}>
          <Sparkles size={16} color={colors.neutral.white} />
        </View>
        <Text style={styles.aiCardTitle}>Asistente BeeAI</Text>
      </View>
      <Text style={styles.aiCardPrompt}>"¿En qué te ayudo hoy?"</Text>

      {/* Quick Action Suggestion Chips - No emojis, using Lucide Icons */}
      <View style={styles.chipsContainer}>
        <TouchableOpacity style={styles.chip} onPress={onChipPress} activeOpacity={0.8}>
          <View style={styles.chipContent}>
            <Calendar size={13} color={colors.neutral.text} style={styles.chipIcon} />
            <Text style={styles.chipText}>Agenda una reunión</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip} onPress={onChipPress} activeOpacity={0.8}>
          <View style={styles.chipContent}>
            <FileText size={13} color={colors.neutral.text} style={styles.chipIcon} />
            <Text style={styles.chipText}>Crea una nota</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.chip} onPress={onChipPress} activeOpacity={0.8}>
          <View style={styles.chipContent}>
            <Mail size={13} color={colors.neutral.text} style={styles.chipIcon} />
            <Text style={styles.chipText}>Redacta un correo</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiCard: {
    backgroundColor: '#F5F3FF', // Very light purple brand tint
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 20,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  aiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiCardBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  aiCardPrompt: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral.text,
  },
});
