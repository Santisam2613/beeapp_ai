import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';
import {
  Bell,
  Sparkles,
  Mail,
  FileText,
  Folder,
  Calendar,
  Phone,
  Users,
  MessageCircle,
  ChevronRight,
} from 'lucide-react-native';
import FloatingTabBar from '../../src/components/FloatingTabBar';
import AssistantMiniChat from '../../src/components/AssistantMiniChat';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false);

  // Mock User Info
  const user = {
    name: 'Santiago',
    occupation: 'CEO en Consultores Asociados',
  };

  const handleGridItemPress = (section: string) => {
    router.push({
      pathname: '/(main)/explore',
      params: { section },
    });
  };

  const handleVerMasEvents = () => {
    router.push({
      pathname: '/(main)/explore',
      params: { section: 'calendar' },
    });
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Workspace Dashboard */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.userInfoRow}>
            {/* User Profile initials */}
            <View style={styles.profileCircle}>
              <Text style={styles.profileCircleText}>S</Text>
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.userTextCol}>
              <Text style={styles.greeting}>Hola, {user.name} 👋</Text>
              <Text style={styles.userOccupation}>{user.occupation}</Text>
            </View>
          </View>
          {/* Notification Badge */}
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <Bell size={22} color={colors.neutral.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured AI Assistant Card */}
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
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setChatVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.chipContent}>
                <Calendar size={13} color={colors.neutral.text} style={styles.chipIcon} />
                <Text style={styles.chipText}>Agenda una reunión</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setChatVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.chipContent}>
                <FileText size={13} color={colors.neutral.text} style={styles.chipIcon} />
                <Text style={styles.chipText}>Crea una nota</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => setChatVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.chipContent}>
                <Mail size={13} color={colors.neutral.text} style={styles.chipIcon} />
                <Text style={styles.chipText}>Redacta un correo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plan and Storage Card */}
        <View style={styles.storageCard}>
          <View style={styles.storageHeaderRow}>
            <View>
              <Text style={styles.storageTitle}>Espacio de Almacenamiento</Text>
              <Text style={styles.planBadge}>Plan BeeApp Plus</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>Mejorar</Text>
            </TouchableOpacity>
          </View>
          {/* Progress bar */}
          <View style={styles.storageProgressBarContainer}>
            <View style={styles.storageProgressBarTrack}>
              <View style={[styles.storageProgressBarFill, { width: '55%' }]} />
            </View>
            <Text style={styles.storageLimitText}>8.2 GB de 15 GB usados (55%)</Text>
          </View>
        </View>

        {/* Quick Access Grid (6 icons, 3x2 aligned perfectly) */}
        <Text style={styles.sectionHeader}>Accesos Rápidos</Text>
        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('mail')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#EBF5FF' }]}>
              <Mail size={22} color="#1E88E5" />
            </View>
            <Text style={styles.gridLabel}>Correo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('notes')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <FileText size={22} color="#D97706" />
            </View>
            <Text style={styles.gridLabel}>Notas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('files')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Folder size={22} color="#059669" />
            </View>
            <Text style={styles.gridLabel}>Archivos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('calendar')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#F3E8FF' }]}>
              <Calendar size={22} color="#7C3AED" />
            </View>
            <Text style={styles.gridLabel}>Calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('calls')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <Phone size={22} color="#0284C7" />
            </View>
            <Text style={styles.gridLabel}>Llamadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => handleGridItemPress('contacts')} activeOpacity={0.7}>
            <View style={[styles.gridIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Users size={22} color="#DC2626" />
            </View>
            <Text style={styles.gridLabel}>Contactos</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <Text style={styles.sectionHeader}>Actividad Reciente</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <View style={[styles.activityIconBadge, { backgroundColor: '#EBF5FF' }]}>
              <Mail size={16} color="#1E88E5" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={styles.activityTitle}>Correo de Carlos "Reunión de avance"</Text>
              <Text style={styles.activityTime}>Hoy, 10:30 AM</Text>
            </View>
            <ChevronRight size={16} color={colors.neutral.gray500} />
          </View>

          <View style={styles.activityItem}>
            <View style={[styles.activityIconBadge, { backgroundColor: '#FEF3C7' }]}>
              <FileText size={16} color="#D97706" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={styles.activityTitle}>Nota creada "Ideas de mercadeo"</Text>
              <Text style={styles.activityTime}>Hoy, 09:15 AM</Text>
            </View>
            <ChevronRight size={16} color={colors.neutral.gray500} />
          </View>

          <View style={[styles.activityItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.activityIconBadge, { backgroundColor: '#E8F5E9' }]}>
              <MessageCircle size={16} color="#2E7D32" />
            </View>
            <View style={styles.activityTextWrap}>
              <Text style={styles.activityTitle}>Mensaje de Whatsapp "Cliente aceptó oferta"</Text>
              <Text style={styles.activityTime}>Ayer, 04:45 PM</Text>
            </View>
            <ChevronRight size={16} color={colors.neutral.gray500} />
          </View>
        </View>

        {/* Upcoming Events Section with inline "Ver más" link */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Próximos Eventos</Text>
          <TouchableOpacity onPress={handleVerMasEvents} activeOpacity={0.7}>
            <Text style={styles.verMasLink}>Ver más</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.eventsCard}>
          <View style={styles.eventItem}>
            <View style={styles.eventTimeWrap}>
              <Text style={styles.eventTimeHour}>14:00</Text>
              <Text style={styles.eventTimeDuration}>45 min</Text>
            </View>
            <View style={styles.eventBarIndicator} />
            <View style={styles.eventTextWrap}>
              <Text style={styles.eventTitle}>Sincronización semanal de equipo</Text>
              <Text style={styles.eventMeta}>En 2 horas • Sala Virtual BeeApp</Text>
            </View>
          </View>

          <View style={[styles.eventItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.eventTimeWrap}>
              <Text style={styles.eventTimeHour}>10:00</Text>
              <Text style={styles.eventTimeDuration}>1 hora</Text>
            </View>
            <View style={[styles.eventBarIndicator, { backgroundColor: colors.semantic.info }]} />
            <View style={styles.eventTextWrap}>
              <Text style={styles.eventTitle}>Presentación de resultados Q2</Text>
              <Text style={styles.eventMeta}>Mañana • Oficina Principal</Text>
            </View>
          </View>
        </View>

        {/* Extra spacing at bottom to avoid floating tab bar overlap */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Pill Menu Tab Bar */}
      <FloatingTabBar activeTab="home" />

      {/* Mini Chat Modal triggered from Suggestion chips or AI button */}
      <AssistantMiniChat visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 24,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileCircleText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.semantic.success,
    borderWidth: 2,
    borderColor: colors.neutral.white,
  },
  userTextCol: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  userOccupation: {
    fontSize: 12,
    color: colors.neutral.gray600,
  },
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.semantic.error,
    borderRadius: 6,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.neutral.white,
    fontSize: 8,
    fontWeight: '900',
  },
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
  storageCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    marginBottom: 24,
  },
  storageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  planBadge: {
    fontSize: 11,
    color: colors.brand.primary,
    fontWeight: '700',
  },
  upgradeBtn: {
    backgroundColor: colors.neutral.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upgradeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  storageProgressBarContainer: {
    width: '100%',
  },
  storageProgressBarTrack: {
    height: 8,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  storageProgressBarFill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: 4,
  },
  storageLimitText: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '500',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verMasLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    width: (SCREEN_WIDTH - 40 - 24) / 3, // Perfect 3-column layout (Container padding: 40px, combined 12px gaps: 24px)
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.text,
  },
  activityCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    marginBottom: 24,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  activityIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityTextWrap: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: colors.neutral.gray600,
  },
  eventsCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    marginBottom: 14,
  },
  eventTimeWrap: {
    width: 50,
    alignItems: 'center',
  },
  eventTimeHour: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  eventTimeDuration: {
    fontSize: 10,
    color: colors.neutral.gray600,
    marginTop: 2,
  },
  eventBarIndicator: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    backgroundColor: colors.brand.primary,
    marginHorizontal: 12,
  },
  eventTextWrap: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  eventMeta: {
    fontSize: 11,
    color: colors.neutral.gray600,
  },
});
