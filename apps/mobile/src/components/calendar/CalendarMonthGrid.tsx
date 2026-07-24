
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '@beeapp/design-system';
import { CalendarEvent, TODAY_STR } from '../../stores/calendarStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Helper date lists for Month grid (simple mock month representation: July 2026)
const daysInJuly = Array.from({ length: 31 }, (_, i) => {
  const dayNum = i + 1;
  const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
  return { dayNum, dateStr };
});

interface CalendarMonthGridProps {
  events: CalendarEvent[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
}

export default function CalendarMonthGrid({ events, selectedDate, onSelectDate }: CalendarMonthGridProps) {
  // Check if date has events
  const dateHasEvents = (dateStr: string) => {
    return events.some((e) => e.date === dateStr);
  };

  // 1st of July 2026 was a Wednesday (3rd column of index 0-based week starting Sunday)
  // We add 3 dummy prefix boxes
  const prefixes = Array.from({ length: 3 });

  return (
    <View style={styles.monthGrid}>
      {/* Days of Week Header */}
      {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map((day) => (
        <Text key={day} style={styles.gridDayHeader}>{day}</Text>
      ))}

      {prefixes.map((_, i) => (
        <View key={`pre-${i}`} style={styles.gridDayBoxEmpty} />
      ))}

      {daysInJuly.map(({ dayNum, dateStr }) => {
        const isToday = dateStr === TODAY_STR;
        const isSelected = dateStr === selectedDate;
        const hasEvent = dateHasEvents(dateStr);

        return (
          <TouchableOpacity
            key={dateStr}
            style={[
              styles.gridDayBox,
              isToday && styles.gridDayBoxToday,
              isSelected && styles.gridDayBoxSelected,
            ]}
            onPress={() => onSelectDate(dateStr)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.gridDayText,
                isToday && styles.gridDayTextToday,
                isSelected && styles.gridDayTextSelected,
              ]}
            >
              {dayNum}
            </Text>
            {hasEvent && (
              <View
                style={[
                  styles.gridEventDot,
                  isSelected && { backgroundColor: colors.neutral.white },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  gridDayHeader: {
    width: (SCREEN_WIDTH - 20) / 7,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral.gray600,
    marginBottom: 8,
  },
  gridDayBox: {
    width: (SCREEN_WIDTH - 20) / 7,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 4,
    position: 'relative',
  },
  gridDayBoxEmpty: {
    width: (SCREEN_WIDTH - 20) / 7,
    height: 44,
  },
  gridDayBoxToday: {
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  gridDayBoxSelected: {
    backgroundColor: colors.brand.primary,
  },
  gridDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.text,
  },
  gridDayTextToday: {
    color: colors.brand.primary,
    fontWeight: '800',
  },
  gridDayTextSelected: {
    color: colors.neutral.white,
    fontWeight: '800',
  },
  gridEventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brand.primary,
    position: 'absolute',
    bottom: 6,
  },
});
