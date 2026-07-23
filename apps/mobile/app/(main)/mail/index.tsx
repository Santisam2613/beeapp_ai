import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Mail,
  Star,
  Paperclip,
  Trash2,
  Archive,
  MailOpen,
  SquarePen,
  Inbox,
  Send,
  File,
  AlertOctagon,
  Settings,
} from 'lucide-react-native';
import FloatingTabBar from '../../../src/components/FloatingTabBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FAB_BOTTOM_OFFSET = 105; // Spacing offset to separate FAB from FloatingTabBar

interface EmailItem {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  bodyPreview: string;
  body: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachment: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'starred' | 'spam' | 'trash';
  account: 'all' | 'santiago.valencia@consultores.com' | 'ventas@empresa.com';
  initialsColor: string;
  attachments?: string[];
}

export default function MailInboxScreen() {
  const router = useRouter();

  // Active accounts and selector states
  const [activeAccount, setActiveAccount] = useState<'all' | 'santiago.valencia@consultores.com' | 'ventas@empresa.com'>('all');
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'unread' | 'sent' | 'drafts' | 'starred' | 'spam' | 'trash'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [swipeActiveId, setSwipeActiveId] = useState<string | null>(null);

  // Mock Emails state
  const [emails, setEmails] = useState<EmailItem[]>([
    {
      id: 'm1',
      senderName: 'Eduardo Torres',
      senderEmail: 'etorres@empresa-cliente.com',
      subject: 'Cotización aprobada para el proyecto Q3',
      bodyPreview: 'Hola Santiago, te confirmo que la junta directiva aprobó el presupuesto estimado para el proyecto de consultoría. Quedamos a la espera del contrato de servicios...',
      body: 'Hola Santiago,\n\nTe confirmo que la junta directiva aprobó el presupuesto estimado para el proyecto de consultoría en su sesión del martes. Todo el equipo de ventas está entusiasmado por iniciar.\n\nQuedamos a la espera del contrato de servicios final para que nuestro equipo legal lo revise y podamos agendar la reunión de kick-off.\n\nSaludos cordiales,\nEduardo Torres\nDirector de Proyectos',
      time: '09:15 AM',
      date: '23 Jul',
      isRead: false,
      isStarred: true,
      hasAttachment: true,
      folder: 'inbox',
      account: 'santiago.valencia@consultores.com',
      initialsColor: '#7C3AED',
      attachments: ['Presupuesto_Aprobado_Q3.pdf', 'Cronograma_Actividades.xlsx'],
    },
    {
      id: 'm2',
      senderName: 'María Alejandra Gomez',
      senderEmail: 'mgomez@consultores.com',
      subject: 'Minuta de la reunión con el equipo legal',
      bodyPreview: 'Hola equipo, les comparto los puntos clave tratados en la llamada de ayer respecto a la protección de datos y las nuevas cláusulas NDA para consultores externos...',
      body: 'Hola equipo,\n\nLes comparto los puntos clave tratados en la llamada de ayer respecto a la protección de datos y las nuevas cláusulas NDA para consultores externos.\n\n1. Aprobación del NDA estándar para contratos nuevos.\n2. Almacenamiento seguro de llaves criptográficas.\n3. Protocolo de comunicación con clientes en Colombia.\n\nPor favor revisen los adjuntos antes del viernes.\n\nAtentamente,\nMaría Alejandra Gomez',
      time: 'Ayer',
      date: '22 Jul',
      isRead: true,
      isStarred: false,
      hasAttachment: true,
      folder: 'inbox',
      account: 'santiago.valencia@consultores.com',
      initialsColor: '#059669',
      attachments: ['NDA_Consultores_v2.docx'],
    },
    {
      id: 'm3',
      senderName: 'Soporte BeeApp',
      senderEmail: 'soporte@beeapp.ai',
      subject: 'Bienvenido a BeeApp AI - Primeros pasos',
      bodyPreview: '¡Hola Santiago! Tu cuenta ya está lista. Descubre cómo usar los accesos rápidos de correo, notas y el asistente inteligente BeeAI para simplificar tu flujo...',
      body: '¡Hola Santiago!\n\nTu cuenta ya está lista. Descubre cómo usar los accesos rápidos de correo, notas y el asistente inteligente BeeAI para simplificar tu flujo.\n\nEn este correo encontrarás una pequeña guía rápida:\n- Vincula tus cuentas de Gmail y Outlook desde el Perfil.\n- Utiliza el botón central del chat para interactuar directamente con tu negocio.\n\nEstamos para ayudarte.\nEl equipo de BeeApp',
      time: '21 Jul',
      date: '21 Jul',
      isRead: true,
      isStarred: true,
      hasAttachment: false,
      folder: 'inbox',
      account: 'ventas@empresa.com',
      initialsColor: '#D97706',
    },
    {
      id: 'm4',
      senderName: 'Santiago Valencia',
      senderEmail: 'santiago.valencia@consultores.com',
      subject: 'Propuesta comercial preliminar - Cliente Q3',
      bodyPreview: 'Adjunto envío borrador con la propuesta estructurada para Eduardo. Favor revisar precios y condiciones comerciales antes del envío formal...',
      body: 'Adjunto envío borrador con la propuesta estructurada para Eduardo. Favor revisar precios y condiciones comerciales antes del envío formal.\n\nQuedo atento a sus sugerencias.',
      time: '20 Jul',
      date: '20 Jul',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      folder: 'sent',
      account: 'santiago.valencia@consultores.com',
      initialsColor: '#1E88E5',
    },
    {
      id: 'm5',
      senderName: 'Newsletter Marketing',
      senderEmail: 'promo@marketin-ideas.com',
      subject: '¡Consigue 100 clientes en 7 días con IA!',
      bodyPreview: 'Oferta exclusiva por tiempo limitado. Aprende las mejores estrategias de automatización del mercado y dispara tus métricas de conversión comercial...',
      body: 'Oferta exclusiva por tiempo limitado. Aprende las mejores estrategias de automatización del mercado y dispara tus métricas de conversión comercial.\n\nCompra hoy mismo.',
      time: '19 Jul',
      date: '19 Jul',
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      folder: 'spam',
      account: 'ventas@empresa.com',
      initialsColor: '#DC2626',
    },
  ]);

  const handleToggleStar = (id: string, e: any) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const handleToggleRead = (id: string, e: any) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email
      )
    );
    setSwipeActiveId(null);
  };

  const handleDeleteMail = (id: string, e: any) => {
    e.stopPropagation();
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, folder: 'trash' } : email
      )
    );
    setSwipeActiveId(null);
    alert('Correo movido a la Papelera.');
  };

  const handleArchiveMail = (id: string, e: any) => {
    e.stopPropagation();
    // Simulate archiving by just changing folder state or hiding it
    setEmails(emails.filter((m) => m.id !== id));
    setSwipeActiveId(null);
    alert('Correo archivado con éxito.');
  };

  const handleSelectAccount = (account: typeof activeAccount) => {
    setActiveAccount(account);
    setAccountMenuVisible(false);
  };

  // Filter logic based on Folder, Account and Search
  const filteredEmails = emails.filter((mail) => {
    // 1. Account Filter
    if (activeAccount !== 'all' && mail.account !== activeAccount) return false;

    // 2. Folder Filter
    if (activeFolder === 'unread') {
      if (mail.isRead || mail.folder !== 'inbox') return false;
    } else if (activeFolder === 'starred') {
      if (!mail.isStarred || mail.folder === 'trash') return false;
    } else {
      if (mail.folder !== activeFolder) return false;
    }

    // 3. Search Query Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        mail.senderName.toLowerCase().includes(query) ||
        mail.subject.toLowerCase().includes(query) ||
        mail.bodyPreview.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getUnreadCount = (folder: string) => {
    return emails.filter((m) => {
      if (activeAccount !== 'all' && m.account !== activeAccount) return false;
      if (folder === 'unread') return !m.isRead && m.folder === 'inbox';
      if (folder === 'starred') return m.isStarred && m.folder !== 'trash';
      return !m.isRead && m.folder === folder;
    }).length;
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const hasEmails = filteredEmails.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with selector */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
            <ChevronLeft size={24} color={colors.neutral.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.accountSelectorBtn}
            onPress={() => setAccountMenuVisible(!accountMenuVisible)}
            activeOpacity={0.8}
          >
            <Text style={styles.accountNameText} numberOfLines={1}>
              {activeAccount === 'all' ? 'Todas las cuentas' : activeAccount}
            </Text>
            <ChevronDown size={16} color={colors.neutral.gray600} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <View style={{ width: 32 }} />
        </View>

        {/* Dropdown Account Selector Menu */}
        {accountMenuVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={[styles.dropdownItem, activeAccount === 'all' && styles.dropdownItemActive]}
              onPress={() => handleSelectAccount('all')}
              activeOpacity={0.7}
            >
              <Inbox size={16} color={activeAccount === 'all' ? colors.brand.primary : colors.neutral.gray600} />
              <Text style={[styles.dropdownText, activeAccount === 'all' && styles.dropdownTextActive]}>Todas las cuentas</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, activeAccount === 'santiago.valencia@consultores.com' && styles.dropdownItemActive]}
              onPress={() => handleSelectAccount('santiago.valencia@consultores.com')}
              activeOpacity={0.7}
            >
              <View style={[styles.accountDot, { backgroundColor: '#7C3AED' }]} />
              <Text style={[styles.dropdownText, activeAccount === 'santiago.valencia@consultores.com' && styles.dropdownTextActive]} numberOfLines={1}>
                santiago.valencia@consultores.com
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dropdownItem, activeAccount === 'ventas@empresa.com' && styles.dropdownItemActive]}
              onPress={() => handleSelectAccount('ventas@empresa.com')}
              activeOpacity={0.7}
            >
              <View style={[styles.accountDot, { backgroundColor: '#D97706' }]} />
              <Text style={[styles.dropdownText, activeAccount === 'ventas@empresa.com' && styles.dropdownTextActive]} numberOfLines={1}>
                ventas@empresa.com
              </Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.dropdownItemLink}
              onPress={() => {
                setAccountMenuVisible(false);
                router.push('/(main)/profile/integrations');
              }}
              activeOpacity={0.7}
            >
              <Settings size={14} color={colors.brand.primary} style={{ marginRight: 8 }} />
              <Text style={styles.dropdownLinkText}>Conectar otra cuenta</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchBarBox}>
          <Search size={18} color={colors.neutral.gray500} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en el correo..."
            placeholderTextColor={colors.neutral.gray500}
            value={searchQuery}
            onChangeText={(txt) => {
              setSearchQuery(txt);
              setSwipeActiveId(null);
            }}
          />
        </View>

        {/* Folder Navigation Chips */}
        <View style={styles.foldersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foldersScroll}>
            {[
              { id: 'inbox', label: 'Recibidos', icon: Inbox },
              { id: 'unread', label: 'No leídos', icon: Mail },
              { id: 'sent', label: 'Enviados', icon: Send },
              { id: 'drafts', label: 'Borradores', icon: File },
              { id: 'starred', label: 'Importantes', icon: Star },
              { id: 'spam', label: 'Spam', icon: AlertOctagon },
              { id: 'trash', label: 'Papelera', icon: Trash2 },
            ].map((folder) => {
              const isActive = activeFolder === folder.id;
              const unreadCount = getUnreadCount(folder.id);
              const IconComp = folder.icon;

              return (
                <TouchableOpacity
                  key={folder.id}
                  style={[styles.folderChip, isActive && styles.folderChipActive]}
                  onPress={() => {
                    setActiveFolder(folder.id as any);
                    setSwipeActiveId(null);
                  }}
                  activeOpacity={0.7}
                >
                  <IconComp size={12} color={isActive ? colors.brand.primary : colors.neutral.gray600} style={{ marginRight: 6 }} />
                  <Text style={[styles.folderChipText, isActive && styles.folderChipTextActive]}>
                    {folder.label}
                  </Text>
                  {unreadCount > 0 && (
                    <View style={[styles.unreadBadge, isActive && styles.unreadBadgeActive]}>
                      <Text style={[styles.unreadBadgeText, isActive && styles.unreadBadgeTextActive]}>
                        {unreadCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Mails Scroll View List */}
        {hasEmails ? (
          <ScrollView style={styles.mailListScroll} showsVerticalScrollIndicator={false}>
            {filteredEmails.map((item) => {
              const isSwipeActive = swipeActiveId === item.id;
              return (
                <View key={item.id} style={styles.mailWrapper}>
                  <TouchableOpacity
                    style={[styles.mailRow, !item.isRead && styles.mailRowUnread]}
                    onPress={() => {
                      // Navigate to detail
                      router.push({
                        pathname: '/(main)/mail/detail',
                        params: { id: item.id },
                      });
                    }}
                    onLongPress={() => setSwipeActiveId(isSwipeActive ? null : item.id)}
                    activeOpacity={0.7}
                  >
                    {/* Sender Color Avatar */}
                    <View style={[styles.avatarCircle, { backgroundColor: item.initialsColor }]}>
                      <Text style={styles.avatarText}>{getInitials(item.senderName)}</Text>
                    </View>

                    {/* Mail description preview */}
                    <View style={styles.mailDetailsCol}>
                      <View style={styles.senderTimeRow}>
                        <Text style={[styles.senderNameText, !item.isRead && styles.senderNameTextUnread]} numberOfLines={1}>
                          {item.senderName}
                        </Text>
                        <Text style={styles.mailTimeText}>{item.time}</Text>
                      </View>
                      
                      <Text style={[styles.subjectText, !item.isRead && styles.subjectTextUnread]} numberOfLines={1}>
                        {item.subject}
                      </Text>
                      
                      <Text style={styles.bodyPreviewText} numberOfLines={2}>
                        {item.bodyPreview}
                      </Text>

                      {/* Icons Row (Attachment & Account) */}
                      <View style={styles.metaRow}>
                        {item.hasAttachment && (
                          <View style={styles.attachmentBadge}>
                            <Paperclip size={10} color={colors.neutral.gray600} style={{ marginRight: 4 }} />
                            <Text style={styles.attachmentCountText}>Adjunto</Text>
                          </View>
                        )}
                        <View style={[styles.accountTag, { borderColor: item.initialsColor }]}>
                          <Text style={[styles.accountTagText, { color: item.initialsColor }]}>
                            {item.account.split('@')[0]}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Star Icon triggers */}
                    <TouchableOpacity
                      onPress={(e) => handleToggleStar(item.id, e)}
                      style={styles.starTouchArea}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={18}
                        color={item.isStarred ? '#F59E0B' : colors.neutral.gray400}
                        fill={item.isStarred ? '#F59E0B' : 'transparent'}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>

                  {/* Swipe Actions Simulation */}
                  {isSwipeActive && (
                    <View style={styles.actionsPanel}>
                      <TouchableOpacity
                        style={[styles.swipeBtn, { backgroundColor: '#EEF2F6' }]}
                        onPress={(e) => handleToggleRead(item.id, e)}
                        activeOpacity={0.8}
                      >
                        <MailOpen size={16} color={colors.neutral.text} />
                        <Text style={styles.swipeBtnText}>{item.isRead ? 'No leído' : 'Leído'}</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.swipeBtn, { backgroundColor: '#E0F2FE' }]}
                        onPress={(e) => handleArchiveMail(item.id, e)}
                        activeOpacity={0.8}
                      >
                        <Archive size={16} color="#0284C7" />
                        <Text style={[styles.swipeBtnText, { color: '#0284C7' }]}>Archivar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.swipeBtn, { backgroundColor: '#FEE2E2' }]}
                        onPress={(e) => handleDeleteMail(item.id, e)}
                        activeOpacity={0.8}
                      >
                        <Trash2 size={16} color={colors.semantic.error} />
                        <Text style={[styles.swipeBtnText, { color: colors.semantic.error }]}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
            <View style={{ height: 120 }} />
          </ScrollView>
        ) : (
          // Empty folder layout
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Mail size={40} color={colors.neutral.gray500} />
            </View>
            <Text style={styles.emptyTitle}>Bandeja Vacía</Text>
            <Text style={styles.emptyDesc}>
              No hay correos en esta carpeta que coincidan con los filtros activos.
            </Text>
          </View>
        )}

        {/* Compose Floating Action Button */}
        <TouchableOpacity
          style={styles.composeFab}
          onPress={() => router.push('/(main)/mail/compose')}
          activeOpacity={0.8}
        >
          <SquarePen size={20} color={colors.neutral.white} style={{ marginRight: 6 }} />
          <Text style={styles.composeFabText}>Redactar</Text>
        </TouchableOpacity>

        {/* Navigation Floating Tab bar */}
        <FloatingTabBar activeTab="home" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
  },
  backBtn: {
    padding: 4,
  },
  accountSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    maxWidth: SCREEN_WIDTH * 0.6,
  },
  accountNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.text,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 54,
    left: 20,
    right: 20,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    paddingVertical: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: '#F9F5FF',
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.text,
    marginLeft: 12,
    flex: 1,
  },
  dropdownTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  accountDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: colors.neutral.gray200,
    marginVertical: 4,
  },
  dropdownItemLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.text,
    paddingVertical: 6,
    fontWeight: '500',
  },
  foldersContainer: {
    paddingVertical: 10,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
  },
  foldersScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  folderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  folderChipActive: {
    backgroundColor: '#F3E8FF',
    borderColor: colors.brand.primary,
  },
  folderChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  folderChipTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  unreadBadge: {
    backgroundColor: colors.neutral.gray400,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
  },
  unreadBadgeActive: {
    backgroundColor: colors.brand.primary,
  },
  unreadBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.gray700,
  },
  unreadBadgeTextActive: {
    color: colors.neutral.white,
  },
  mailListScroll: {
    flex: 1,
  },
  mailWrapper: {
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  mailRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: colors.neutral.white,
  },
  mailRowUnread: {
    backgroundColor: '#FAF8FF',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  avatarText: {
    color: colors.neutral.white,
    fontSize: 14,
    fontWeight: '800',
  },
  mailDetailsCol: {
    flex: 1,
    paddingRight: 24,
  },
  senderTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderNameText: {
    fontSize: 13,
    color: colors.neutral.text,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  senderNameTextUnread: {
    fontWeight: '800',
  },
  mailTimeText: {
    fontSize: 11,
    color: colors.neutral.gray600,
  },
  subjectText: {
    fontSize: 13,
    color: colors.neutral.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  subjectTextUnread: {
    fontWeight: '800',
    color: colors.brand.primary,
  },
  bodyPreviewText: {
    fontSize: 12,
    color: colors.neutral.gray700,
    lineHeight: 16,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray50,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  attachmentCountText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  accountTag: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
  },
  accountTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  starTouchArea: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    padding: 4,
  },
  actionsPanel: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 10,
    width: 210,
  },
  swipeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeBtnText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral.text,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 18,
  },
  composeFab: {
    position: 'absolute',
    bottom: FAB_BOTTOM_OFFSET,
    right: 20,
    backgroundColor: colors.brand.primary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  composeFabText: {
    color: colors.neutral.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
