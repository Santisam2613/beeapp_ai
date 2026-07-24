import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { colors } from '@beeapp/design-system';
import { Plus } from 'lucide-react-native';
import FloatingTabBar from '../../../src/components/FloatingTabBar';
import { getEvents, setEvents, CalendarEvent, TODAY_STR } from '../../../src/stores/calendarStore';
import CalendarMonthGrid from '../../../src/components/calendar/CalendarMonthGrid';
import CalendarHourlyAgenda from '../../../src/components/calendar/CalendarHourlyAgenda';
import CalendarEventsList from '../../../src/components/calendar/CalendarEventsList';
import { CalendarContextMenu, CalendarFabMenu, FAB_BOTTOM_OFFSET } from '../../../src/components/calendar/CalendarMenus';
import { CalendarHeader, CalendarFilterChips, ViewMode, FilterChip } from '../../../src/components/calendar/CalendarHeader';

export default function CalendarIndexScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Calendar States
  const [events, setLocalEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);
  const [currentView, setCurrentView] = useState<ViewMode>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterChip>('upcoming');

  // Menu / Modal states
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [fabMenuVisible, setFabMenuVisible] = useState(false);

  // Load events
  useEffect(() => {
    setLocalEvents(getEvents());
    const unsubscribe = navigation.addListener('focus', () => {
      setLocalEvents(getEvents());
    });
    return unsubscribe;
  }, [navigation]);

  const syncEvents = (newEvents: CalendarEvent[]) => {
    setLocalEvents(newEvents);
    setEvents(newEvents);
  };

  // Delete event
  const handleDeleteEvent = (event: CalendarEvent) => {
    const updated = events.filter((e) => e.id !== event.id);
    syncEvents(updated);
    alert('Reunión/Evento eliminado.');
    setContextMenuVisible(false);
    setActiveEvent(null);
  };

  // Duplicate event
  const handleDuplicateEvent = (event: CalendarEvent) => {
    const duplicated: CalendarEvent = {
      ...event,
      id: `e-dup-${Date.now()}`,
      title: `${event.title} (Copia)`,
      date: TODAY_STR,
    };
    syncEvents([...events, duplicated]);
    alert('Elemento duplicado para Hoy.');
    setContextMenuVisible(false);
    setActiveEvent(null);
  };

  // Filter events logic
  const getFilteredEvents = () => {
    let list = events;

    // 1. Search Query
    if (searchQuery) {
      list = list.filter((e) => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      // If not searching, filter by selected date
      list = list.filter((e) => e.date === selectedDate);
    }

    // 2. Filter chips
    const todayNum = new Date(TODAY_STR).getTime();
    if (activeFilter === 'upcoming') {
      list = list.filter((e) => new Date(e.date).getTime() >= todayNum);
    } else if (activeFilter === 'past') {
      list = list.filter((e) => new Date(e.date).getTime() < todayNum);
    } else if (activeFilter === 'meetings') {
      list = list.filter((e) => e.type === 'meeting');
    } else if (activeFilter === 'events') {
      list = list.filter((e) => e.type === 'event');
    }

    return list.sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  };

  const handleFabAction = (type: 'meeting' | 'event') => {
    setFabMenuVisible(false);
    router.push({
      pathname: '/(main)/calendar/edit',
      params: { type, date: selectedDate },
    });
  };

  const openContextMenu = (event: CalendarEvent) => {
    setActiveEvent(event);
    setContextMenuVisible(true);
  };

  const goToDetail = (event: CalendarEvent) => {
    router.push({
      pathname: '/(main)/calendar/detail',
      params: { id: event.id },
    });
  };

  const filteredEvents = getFilteredEvents();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CalendarHeader
          onBack={() => router.back()}
          onToday={() => setSelectedDate(TODAY_STR)}
          currentView={currentView}
          onViewChange={setCurrentView}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Main Calendar Viewport */}
          <View style={styles.calendarViewport}>
            {currentView === 'month' ? (
              <CalendarMonthGrid events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            ) : (
              // Week / Day lists are represented by selected date hourly planners
              <View style={styles.plannerContainer}>
                <Text style={styles.plannerSelectedDay}>
                  Agenda para el {selectedDate.split('-')[2]} de Julio
                </Text>
                <CalendarHourlyAgenda
                  events={events}
                  selectedDate={selectedDate}
                  onEventPress={goToDetail}
                  onEventLongPress={openContextMenu}
                />
              </View>
            )}
          </View>

          {/* Filter Chips */}
          <CalendarFilterChips activeFilter={activeFilter} onChange={setActiveFilter} />

          {/* Events List */}
          <Text style={styles.sectionTitle}>Eventos del día</Text>
          <CalendarEventsList
            events={filteredEvents}
            onEventPress={goToDetail}
            onEventLongPress={openContextMenu}
          />

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Options Context Menu Overlay */}
        <CalendarContextMenu
          visible={contextMenuVisible}
          event={activeEvent}
          onClose={() => setContextMenuVisible(false)}
          onViewDetail={goToDetail}
          onEdit={(event) =>
            router.push({
              pathname: '/(main)/calendar/edit',
              params: { id: event.id, type: event.type },
            })
          }
          onDuplicate={handleDuplicateEvent}
          onDelete={handleDeleteEvent}
        />

        {/* FAB Menu Selection Drawer */}
        <CalendarFabMenu
          visible={fabMenuVisible}
          onClose={() => setFabMenuVisible(false)}
          onAction={handleFabAction}
        />

        {/* FAB (+) Trigger - Respecting vertical height offset */}
        <TouchableOpacity
          style={styles.createFab}
          onPress={() => setFabMenuVisible(!fabMenuVisible)}
          activeOpacity={0.8}
        >
          <Plus size={24} color={colors.neutral.white} />
        </TouchableOpacity>

        {/* Tab Menu bar */}
        <FloatingTabBar activeTab="explore" />
      </View>
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
  mainScroll: {
    flex: 1,
  },
  calendarViewport: {
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray200,
    paddingVertical: 16,
  },
  plannerContainer: {
    paddingHorizontal: 20,
  },
  plannerSelectedDay: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray700,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  createFab: {
    position: 'absolute',
    bottom: FAB_BOTTOM_OFFSET,
    right: 20,
    backgroundColor: colors.brand.primary,
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
