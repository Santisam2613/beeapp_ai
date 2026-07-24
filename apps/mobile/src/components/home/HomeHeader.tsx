
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@beeapp/design-system';
import { Bell } from 'lucide-react-native';

interface HomeHeaderProps {
  userName: string;
  occupation: string;
  onNotificationsPress: () => void;
}

export default function HomeHeader({ userName, occupation, onNotificationsPress }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.userInfoRow}>
        {/* User Profile initials */}
        <View style={styles.profileCircle}>
          <Text style={styles.profileCircleText}>S</Text>
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.userTextCol}>
          <Text style={styles.greeting}>Hola, {userName} 👋</Text>
          <Text style={styles.userOccupation}>{occupation}</Text>
        </View>
      </View>
      {/* Notification Badge */}
      <TouchableOpacity style={styles.notificationBtn} onPress={onNotificationsPress} activeOpacity={0.7}>
        <Bell size={22} color={colors.neutral.text} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
