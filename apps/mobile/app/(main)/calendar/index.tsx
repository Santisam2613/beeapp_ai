import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { colors } from '@beeapp/design-system';
import {
  ChevronLeft,
  Search,
  Calendar as CalendarIcon,
  Plus,
  Video,
  MapPin,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Eye,
} from 'lucide-react-native';
import FloatingTabBar from '../../../src/components/FloatingTabBar';
import { getEvents, setEvents, CalendarEvent, TODAY_STR } from './store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FAB_BOTTOM_OFFSET = 105;

type ViewMode = 'day' | 'week' | 'month';
type FilterChip = 'upcoming' | 'past' | 'meetings' | 'events';

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

  // Helper date lists for Month grid (simple mock month representation: July 2026)
  const daysInJuly = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
    return { dayNum, dateStr };
  });

  // Check if date has events
  const dateHasEvents = (dateStr: string) => {
    return events.some((e) => e.date === dateStr);
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

  const formatHoursList = () => {
    return Array.from({ length: 12 }, (_, i) => {
      const hr = i + 8; // 8:00 to 19:00
      return `${String(hr).padStart(2, '0')}:00`;
    });
  };

  const renderMonthGrid = () => {
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
              onPress={() => setSelectedDate(dateStr)}
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
  };

  const renderHourlyAgenda = () => {
    const hours = formatHoursList();
    const activeEvents = events.filter((e) => e.date === selectedDate);

    return (
      <ScrollView style={styles.hourlyScroll} nestedScrollEnabled>
        {hours.map((hour) => {
          const matchedEvent = activeEvents.find((e) => e.timeStart.startsWith(hour.slice(0, 2)));

          return (
            <View key={hour} style={styles.hourRow}>
              <Text style={styles.hourLabel}>{hour}</Text>
              <View style={styles.hourLine} />
              <View style={styles.hourBlockContent}>
                {matchedEvent ? (
                  <TouchableOpacity
                    style={[
                      styles.hourlyEventCard,
                      matchedEvent.type === 'meeting' ? styles.hourlyMeeting : styles.hourlyEvent,
                    ]}
                    onPress={() =>
                      router.push({
                        pathname: '/(main)/calendar/detail',
                        params: { id: matchedEvent.id },
                      })
                    }
                    onLongPress={() => openContextMenu(matchedEvent)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.hourlyEventTitle} numberOfLines={1}>
                      {matchedEvent.title}
                    </Text>
                    <Text style={styles.hourlyEventMeta}>
                      {matchedEvent.timeStart} - {matchedEvent.timeEnd} ({matchedEvent.duration})
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };

  const filteredEvents = getFilteredEvents();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftCol}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
              <ChevronLeft size={24} color={colors.neutral.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Calendario</Text>
          </View>

          {/* Today and View triggers */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setSelectedDate(TODAY_STR)}
              style={styles.todayBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.todayBtnText}>Hoy</Text>
            </TouchableOpacity>

            <View style={styles.viewSegment}>
              {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.segmentBtn, currentView === v && styles.segmentBtnActive]}
                  onPress={() => setCurrentView(v)}
                >
                  <Text style={[styles.segmentText, currentView === v && styles.segmentTextActive]}>
                    {v === 'day' ? 'Día' : v === 'week' ? 'Sem' : 'Mes'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBarBox}>
          <Search size={18} color={colors.neutral.gray500} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar reuniones y eventos..."
            placeholderTextColor={colors.neutral.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.mainScroll} showsVerticalScrollIndicator={false}>
          {/* Main Calendar Viewport */}
          <View style={styles.calendarViewport}>
            {currentView === 'month' ? (
              renderMonthGrid()
            ) : (
              // Week / Day lists are represented by selected date hourly planners
              <View style={styles.plannerContainer}>
                <Text style={styles.plannerSelectedDay}>
                  Agenda para el {selectedDate.split('-')[2]} de Julio
                </Text>
                {renderHourlyAgenda()}
              </View>
            )}
          </View>

          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContent}>
            {[
              { id: 'upcoming', label: 'Próximos' },
              { id: 'past', label: 'Pasados' },
              { id: 'meetings', label: 'Reuniones' },
              { id: 'events', label: 'Eventos' },
            ].map((f) => {
              const active = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  onPress={() => setActiveFilter(f.id as any)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{f.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Events List */}
          <Text style={styles.sectionTitle}>Eventos del día</Text>
          <View style={styles.eventsListContainer}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.eventCard}
                  onPress={() =>
                    router.push({
                      pathname: '/(main)/calendar/detail',
                      params: { id: item.id },
                    })
                  }
                  onLongPress={() => openContextMenu(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTimeColumn}>
                    <Text style={styles.cardTimeText}>{item.timeStart}</Text>
                    <Text style={styles.cardDurationText}>{item.duration}</Text>
                  </View>

                  <View style={styles.cardBarIndicator} />

                  <View style={styles.cardDetailsColumn}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardMetaRow}>
                      {item.isVirtual ? (
                        <View style={styles.metaBadge}>
                          <Video size={10} color="#7C3AED" style={{ marginRight: 3 }} />
                          <Text style={[styles.metaBadgeText, { color: '#7C3AED' }]}>Videollamada</Text>
                        </View>
                      ) : (
                        <View style={styles.metaBadge}>
                          <MapPin size={10} color="#059669" style={{ marginRight: 3 }} />
                          <Text style={[styles.metaBadgeText, { color: '#059669' }]}>
                            {item.location || 'Presencial'}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Invitees avatars list */}
                    {item.invitees.length > 0 && (
                      <View style={styles.avatarsRow}>
                        {item.invitees.slice(0, 3).map((inv, idx) => (
                          <View
                            key={idx}
                            style={[
                              styles.avatarCircle,
                              { backgroundColor: inv.color, marginLeft: idx > 0 ? -8 : 0 },
                            ]}
                          >
                            <Text style={styles.avatarText}>{inv.initials}</Text>
                          </View>
                        ))}
                        {item.invitees.length > 3 && (
                          <Text style={styles.moreAvatars}>+{item.invitees.length - 3}</Text>
                        )}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.cardMenuTrigger}
                    onPress={() => openContextMenu(item)}
                    activeOpacity={0.7}
                  >
                    <MoreVertical size={16} color={colors.neutral.gray600} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              // Empty State
              <View style={styles.emptyContainer}>
                <CalendarIcon size={32} color={colors.neutral.gray400} style={{ marginBottom: 8 }} />
                <Text style={styles.emptyText}>Sin eventos para este día</Text>
              </View>
            )}
          </View>

          <View style={{ height: 160 }} />
        </ScrollView>

        {/* Options Context Menu Overlay */}
        <Modal transparent visible={contextMenuVisible} animationType="slide">
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setContextMenuVisible(false)}>
            <View style={styles.contextMenuSheet}>
              {activeEvent && (
                <>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle} numberOfLines={1}>{activeEvent.title}</Text>
                    <Text style={styles.menuSub}>
                      {activeEvent.type === 'meeting' ? 'Reunión Virtual' : 'Evento Presencial'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => {
                      setContextMenuVisible(false);
                      router.push({
                        pathname: '/(main)/calendar/detail',
                        params: { id: activeEvent.id },
                      });
                    }}
                  >
                    <Eye size={18} color={colors.neutral.text} />
                    <Text style={styles.menuRowText}>Ver detalle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuRow}
                    onPress={() => {
                      setContextMenuVisible(false);
                      router.push({
                        pathname: '/(main)/calendar/edit',
                        params: { id: activeEvent.id, type: activeEvent.type },
                      });
                    }}
                  >
                    <Edit2 size={18} color={colors.neutral.text} />
                    <Text style={styles.menuRowText}>Editar reunión/evento</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuRow} onPress={() => handleDuplicateEvent(activeEvent)}>
                    <Copy size={18} color={colors.neutral.text} />
                    <Text style={styles.menuRowText}>Duplicar en Hoy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuRow, { borderBottomWidth: 0 }]}
                    onPress={() => handleDeleteEvent(activeEvent)}
                  >
                    <Trash2 size={18} color={colors.semantic.error} />
                    <Text style={[styles.menuRowText, { color: colors.semantic.error }]}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* FAB Menu Selection Drawer */}
        {fabMenuVisible && (
          <Modal transparent visible={fabMenuVisible} animationType="fade">
            <TouchableOpacity
              style={styles.fabBackdrop}
              activeOpacity={1}
              onPress={() => setFabMenuVisible(false)}
            >
              <View style={[styles.fabMenuContainer, { bottom: FAB_BOTTOM_OFFSET + 65 }]}>
                <TouchableOpacity style={styles.fabMenuRow} onPress={() => handleFabAction('meeting')}>
                  <Video size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Nueva reunión (con video)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.fabMenuRow, { borderBottomWidth: 0 }]} onPress={() => handleFabAction('event')}>
                  <CalendarIcon size={16} color="#7C3AED" />
                  <Text style={styles.fabMenuText}>Nuevo evento (presencial)</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todayBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    backgroundColor: colors.neutral.white,
  },
  todayBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  viewSegment: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.gray600,
  },
  segmentTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.neutral.text,
    paddingVertical: 6,
    fontWeight: '500',
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
  plannerContainer: {
    paddingHorizontal: 20,
  },
  plannerSelectedDay: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray700,
    marginBottom: 12,
  },
  hourlyScroll: {
    maxHeight: 280,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 16,
    backgroundColor: colors.neutral.white,
    padding: 12,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  hourLabel: {
    width: 45,
    fontSize: 10,
    fontWeight: '700',
    color: colors.neutral.gray600,
  },
  hourLine: {
    width: 8,
    height: 1,
    backgroundColor: colors.neutral.gray200,
    marginRight: 8,
  },
  hourBlockContent: {
    flex: 1,
    height: '80%',
    justifyContent: 'center',
  },
  hourlyEventCard: {
    flex: 1,
    borderRadius: 8,
    paddingLeft: 10,
    justifyContent: 'center',
    borderLeftWidth: 3,
  },
  hourlyMeeting: {
    backgroundColor: '#FAF5FF',
    borderLeftColor: '#7C3AED',
  },
  hourlyEvent: {
    backgroundColor: '#ECFDF5',
    borderLeftColor: '#059669',
  },
  hourlyEventTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  hourlyEventMeta: {
    fontSize: 9,
    color: colors.neutral.gray600,
    fontWeight: '500',
    marginTop: 2,
  },
  filtersScroll: {
    marginVertical: 14,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.neutral.white,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  filterChipActive: {
    backgroundColor: '#F3E8FF',
    borderColor: colors.brand.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  filterChipTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
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
  eventsListContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 14,
  },
  cardTimeColumn: {
    width: 60,
    alignItems: 'center',
  },
  cardTimeText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  cardDurationText: {
    fontSize: 10,
    color: colors.neutral.gray600,
    fontWeight: '600',
    marginTop: 2,
  },
  cardBarIndicator: {
    width: 4,
    height: '80%',
    borderRadius: 2,
    backgroundColor: colors.brand.primary,
    marginHorizontal: 12,
  },
  cardDetailsColumn: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: colors.neutral.gray200,
  },
  metaBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.white,
  },
  avatarText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  moreAvatars: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral.gray600,
    marginLeft: 6,
  },
  cardMenuTrigger: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  emptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray500,
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
    justifyContent: 'flex-end',
  },
  contextMenuSheet: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  menuHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    paddingBottom: 12,
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  menuSub: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginTop: 2,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    gap: 12,
  },
  menuRowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.text,
  },
  fabBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
  },
  fabMenuContainer: {
    position: 'absolute',
    right: 20,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  fabMenuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    gap: 10,
  },
  fabMenuText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.text,
  },
});
