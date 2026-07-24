import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';
import { Settings } from 'lucide-react-native';
import FloatingTabBar from '../../src/components/FloatingTabBar';
import AssistantMiniChat from '../../src/components/AssistantMiniChat';
import HomeHeader from '../../src/components/home/HomeHeader';
import HomeAssistantCard from '../../src/components/home/HomeAssistantCard';
import HomeStorageCard from '../../src/components/home/HomeStorageCard';
import HomeQuickAccessGrid from '../../src/components/home/HomeQuickAccessGrid';
import { HomeActivityCard, HomeEventsCard } from '../../src/components/home/HomeOverviewCards';
import HomeCustomizeModal from '../../src/components/home/HomeCustomizeModal';

export default function HomeScreen() {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false);

  // Customization of quick accesses state (default to Correo, Notas, Contactos)
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(['mail', 'notes', 'contacts']);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [tempSelectedModuleIds, setTempSelectedModuleIds] = useState<string[]>(['mail', 'notes', 'contacts']);

  // Mock User Info
  const user = {
    name: 'Santiago',
    occupation: 'CEO en Consultores Asociados',
  };

  const handleGridItemPress = (section: string) => {
    if (section === 'mail') {
      router.push('/(main)/mail');
    } else if (section === 'notes') {
      router.push('/(main)/notes');
    } else if (section === 'files') {
      router.push('/(main)/storage');
    } else if (section === 'contacts') {
      router.push('/(main)/contacts');
    } else if (section === 'calendar') {
      router.push('/(main)/calendar');
    } else {
      router.push({
        pathname: '/(main)/explore',
        params: { section },
      });
    }
  };

  const handleVerMasEvents = () => {
    router.push('/(main)/calendar');
  };

  const openCustomize = () => {
    setTempSelectedModuleIds([...selectedModuleIds]);
    setIsCustomizing(true);
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
        <HomeHeader
          userName={user.name}
          occupation={user.occupation}
          onNotificationsPress={() => router.push('/(main)/notifications')}
        />

        {/* Featured AI Assistant Card */}
        <HomeAssistantCard onChipPress={() => setChatVisible(true)} />

        {/* Plan and Storage Card */}
        <HomeStorageCard />

        {/* Quick Access Grid (Customizable, showing exactly 3 elements) */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Accesos Rápidos</Text>
            <TouchableOpacity onPress={openCustomize} style={{ marginLeft: 8 }} activeOpacity={0.7}>
              <Settings size={16} color={colors.brand.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/(main)/explore')} activeOpacity={0.7}>
            <Text style={styles.verMasLink}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <HomeQuickAccessGrid
          selectedModuleIds={selectedModuleIds}
          onItemPress={handleGridItemPress}
          onCustomize={openCustomize}
        />

        {/* Recent Activity Section */}
        <Text style={styles.sectionHeader}>Actividad Reciente</Text>
        <HomeActivityCard />

        {/* Upcoming Events Section with inline "Ver más" link */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>Próximos Eventos</Text>
          <TouchableOpacity onPress={handleVerMasEvents} activeOpacity={0.7}>
            <Text style={styles.verMasLink}>Ver más</Text>
          </TouchableOpacity>
        </View>

        <HomeEventsCard />

        {/* Extra spacing at bottom to avoid floating tab bar overlap */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Pill Menu Tab Bar */}
      <FloatingTabBar activeTab="home" />

      {/* Mini Chat Modal triggered from Suggestion chips or AI button */}
      <AssistantMiniChat visible={chatVisible} onClose={() => setChatVisible(false)} />

      {/* Personalization Modal */}
      <HomeCustomizeModal
        visible={isCustomizing}
        selectedIds={tempSelectedModuleIds}
        onChangeSelected={setTempSelectedModuleIds}
        onCancel={() => setIsCustomizing(false)}
        onSave={() => {
          setSelectedModuleIds(tempSelectedModuleIds);
          setIsCustomizing(false);
          alert('Accesos rápidos actualizados.');
        }}
      />
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
});
