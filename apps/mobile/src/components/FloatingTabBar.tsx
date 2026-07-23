import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';
import { Home, Compass, Sparkles, MessageCircle, User } from 'lucide-react-native';
import AssistantMiniChat from './AssistantMiniChat';

interface FloatingTabBarProps {
  activeTab: 'home' | 'explore' | 'chat' | 'profile';
}

export default function FloatingTabBar({ activeTab }: FloatingTabBarProps) {
  const router = useRouter();
  const [chatVisible, setChatVisible] = useState(false);

  const navigateTo = (route: string) => {
    router.replace(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {/* Inicio */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigateTo('/(main)')}
          activeOpacity={0.7}
        >
          <Home
            size={22}
            color={activeTab === 'home' ? colors.brand.primary : colors.neutral.gray500}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === 'home' ? colors.brand.primary : colors.neutral.gray500 },
            ]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        {/* Explora */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigateTo('/(main)/explore')}
          activeOpacity={0.7}
        >
          <Compass
            size={22}
            color={activeTab === 'explore' ? colors.brand.primary : colors.neutral.gray500}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === 'explore' ? colors.brand.primary : colors.neutral.gray500 },
            ]}
          >
            Explora
          </Text>
        </TouchableOpacity>

        {/* Botón Central de IA (Destacado) */}
        <View style={styles.aiContainer}>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => setChatVisible(true)}
            activeOpacity={0.8}
          >
            <Sparkles size={26} color={colors.neutral.white} />
          </TouchableOpacity>
          <Text style={styles.aiLabel}>Asistente</Text>
        </View>

        {/* Chat */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigateTo('/(main)/chat')}
          activeOpacity={0.7}
        >
          <MessageCircle
            size={22}
            color={activeTab === 'chat' ? colors.brand.primary : colors.neutral.gray500}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === 'chat' ? colors.brand.primary : colors.neutral.gray500 },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>

        {/* Perfil */}
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigateTo('/(main)/profile')}
          activeOpacity={0.7}
        >
          <User
            size={22}
            color={activeTab === 'profile' ? colors.brand.primary : colors.neutral.gray500}
          />
          <Text
            style={[
              styles.label,
              { color: activeTab === 'profile' ? colors.brand.primary : colors.neutral.gray500 },
            ]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mini Chat Modal */}
      <AssistantMiniChat visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 28 : 16,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 99,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  aiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    flex: 1.2,
  },
  aiButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 4,
    borderColor: colors.neutral.white,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.brand.primary,
    marginTop: 2,
  },
});
