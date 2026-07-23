import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@beeapp/design-system';
import {
  Camera,
  Building2,
  Package,
  Wrench,
  RefreshCw,
  Smile,
  Briefcase,
  Zap,
  Bot,
  Mail,
  MessageCircle,
  FileText,
  Folder,
  Calendar,
  Sparkles,
  Bell,
  MapPin,
  Mic,
  HardDrive,
} from 'lucide-react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 States - About You
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  // Step 1 States - About Business
  const [hasBusiness, setHasBusiness] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [hasBusinessLogo, setHasBusinessLogo] = useState(false);
  const [offeringType, setOfferingType] = useState<'products' | 'services' | 'both'>('services');
  const [whatYouSell, setWhatYouSell] = useState('');

  // Step 2 States - Assistant Customization
  const [assistantName, setAssistantName] = useState('BeeAI');
  const [tone, setTone] = useState<'friendly' | 'professional' | 'direct'>('friendly');

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        alert('Por favor ingresa tu nombre completo para continuar.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!assistantName.trim()) {
        alert('Por favor ingresa un nombre para tu asistente.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      router.replace('/(main)');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else {
      router.replace('/(auth)/login');
    }
  };

  // Helper to get initials for avatar mock
  const getInitials = (text: string) => {
    if (!text) return '';
    return text
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Assistant preview text generator
  const getAssistantPreviewText = () => {
    const userName = name.trim() ? name.split(' ')[0] : 'Usuario';
    const assName = assistantName.trim() ? assistantName : 'BeeAI';

    switch (tone) {
      case 'friendly':
        return `¡Hola, ${userName}! Qué gusto saludarte hoy. Soy ${assName}, tu asistente personal de confianza. ¿En qué te puedo colaborar el día de hoy? 😊`;
      case 'professional':
        return `Estimado ${userName}, le saluda ${assName}. Quedo a su completa disposición para colaborar y optimizar sus actividades profesionales el día de hoy.`;
      case 'direct':
        return `${userName}. Le habla ${assName}. Indique la instrucción o consulta a ejecutar de inmediato para empezar a trabajar.`;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            {/* Top Navigation & Progress */}
            <View style={styles.progressHeader}>
              <TouchableOpacity onPress={handleBack} style={styles.backNavButton}>
                <Text style={styles.backNavText}>← Atrás</Text>
              </TouchableOpacity>
              <Text style={styles.progressText}>Paso {step} de 3</Text>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    { width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' },
                  ]}
                />
              </View>
            </View>

            {/* Step Content */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {step === 1 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Vamos a conocerte</Text>
                  <Text style={styles.subtitle}>
                    Queremos conocerte a ti y a tu negocio para personalizar tu experiencia.
                  </Text>

                  {/* Section A: About You */}
                  <View style={styles.sectionCard}>
                    <Text style={styles.sectionHeader}>Sobre Ti</Text>
                    
                    {/* Avatar selection mock */}
                    <View style={styles.avatarRow}>
                      <TouchableOpacity
                        style={styles.avatarButton}
                        activeOpacity={0.8}
                        onPress={() => setHasPhoto(!hasPhoto)}
                      >
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
                        onChangeText={setName}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>¿A qué te dedicas?</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Ej. Desarrollador, Gerente, Diseñador"
                        placeholderTextColor={colors.neutral.gray500}
                        value={occupation}
                        onChangeText={setOccupation}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Ciudad o Dirección</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Ej. Bogotá, Colombia"
                        placeholderTextColor={colors.neutral.gray500}
                        value={address}
                        onChangeText={setAddress}
                      />
                    </View>
                  </View>

                  {/* Section B: About Business (Opcional) */}
                  <View style={styles.sectionCard}>
                    <View style={styles.businessToggleRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.sectionHeader}>Tu Negocio / Empresa</Text>
                        <Text style={styles.sectionSubtitle}>¿Tienes un negocio propio? (Opcional)</Text>
                      </View>
                      <View style={styles.toggleButtons}>
                        <TouchableOpacity
                          style={[styles.toggleBtn, !hasBusiness && styles.toggleBtnActive]}
                          onPress={() => setHasBusiness(false)}
                        >
                          <Text style={[styles.toggleBtnText, !hasBusiness && styles.toggleBtnTextActive]}>No</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.toggleBtn, hasBusiness && styles.toggleBtnActive]}
                          onPress={() => setHasBusiness(true)}
                        >
                          <Text style={[styles.toggleBtnText, hasBusiness && styles.toggleBtnTextActive]}>Sí</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {hasBusiness && (
                      <View style={styles.businessExpandedArea}>
                        {/* Business Logo Selection Mock */}
                        <View style={styles.avatarRow}>
                          <TouchableOpacity
                            style={styles.logoButton}
                            activeOpacity={0.8}
                            onPress={() => setHasBusinessLogo(!hasBusinessLogo)}
                          >
                            {hasBusinessLogo ? (
                              <View style={[styles.logoCircle, styles.avatarActive]}>
                                <Text style={styles.logoText}>{getInitials(businessName) || 'CORP'}</Text>
                                <View style={styles.avatarCheckBadge}>
                                  <Text style={styles.avatarCheckText}>✓</Text>
                                </View>
                              </View>
                            ) : (
                              <View style={styles.logoCircle}>
                                <Building2 size={24} color={colors.neutral.gray600} style={{ marginBottom: 4 }} />
                                <Text style={styles.logoPlaceholderText}>Logo</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                          <View style={styles.avatarInfo}>
                            <Text style={styles.avatarInfoTitle}>Logo de la Empresa</Text>
                            <Text style={styles.avatarInfoDesc}>
                              {hasBusinessLogo ? 'Logo cargado (Simulado)' : 'Toca para simular logo (Opcional)'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>Nombre de la Empresa</Text>
                          <TextInput
                            style={styles.inputField}
                            placeholder="Ej. Consultores Asociados S.A.S."
                            placeholderTextColor={colors.neutral.gray500}
                            value={businessName}
                            onChangeText={setBusinessName}
                          />
                        </View>

                        {/* Offering Type Selector */}
                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>¿Qué Ofreces?</Text>
                          <View style={styles.selectorRow}>
                            <TouchableOpacity
                              style={[styles.selectorCard, offeringType === 'products' && styles.selectorCardActive]}
                              onPress={() => setOfferingType('products')}
                            >
                              <View style={styles.selectorIconTextRow}>
                                <Package size={14} color={offeringType === 'products' ? colors.brand.primary : colors.neutral.gray600} style={styles.selectorIcon} />
                                <Text style={[styles.selectorCardText, offeringType === 'products' && styles.selectorCardTextActive]}>Productos</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.selectorCard, offeringType === 'services' && styles.selectorCardActive]}
                              onPress={() => setOfferingType('services')}
                            >
                              <View style={styles.selectorIconTextRow}>
                                <Wrench size={14} color={offeringType === 'services' ? colors.brand.primary : colors.neutral.gray600} style={styles.selectorIcon} />
                                <Text style={[styles.selectorCardText, offeringType === 'services' && styles.selectorCardTextActive]}>Servicios</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.selectorCard, offeringType === 'both' && styles.selectorCardActive]}
                              onPress={() => setOfferingType('both')}
                            >
                              <View style={styles.selectorIconTextRow}>
                                <RefreshCw size={14} color={offeringType === 'both' ? colors.brand.primary : colors.neutral.gray600} style={styles.selectorIcon} />
                                <Text style={[styles.selectorCardText, offeringType === 'both' && styles.selectorCardTextActive]}>Ambos</Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>¿Qué Vendes exactamente?</Text>
                          <TextInput
                            style={styles.inputField}
                            placeholder="Ej. Zapatos deportivos, software contable..."
                            placeholderTextColor={colors.neutral.gray500}
                            value={whatYouSell}
                            onChangeText={setWhatYouSell}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Personaliza tu asistente</Text>
                  <Text style={styles.subtitle}>
                    BeeApp AI incluye tu propio asistente inteligente para automatizar tus tareas diarias.
                  </Text>

                  {/* Assistant custom Card */}
                  <View style={styles.sectionCard}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nombre del Asistente *</Text>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Ej. BeeAI, Colmena, Asistente..."
                        placeholderTextColor={colors.neutral.gray500}
                        value={assistantName}
                        onChangeText={setAssistantName}
                      />
                    </View>

                    {/* Tone Selectors */}
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Tono de Trato del Asistente</Text>
                      
                      <TouchableOpacity
                        style={[styles.toneCard, tone === 'friendly' && styles.toneCardActive]}
                        onPress={() => setTone('friendly')}
                        activeOpacity={0.8}
                      >
                        <View style={styles.toneIconWrap}>
                          <Smile size={20} color={colors.brand.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.toneTitle, tone === 'friendly' && styles.toneTitleActive]}>Amable</Text>
                          <Text style={styles.toneDesc}>Trato empático, cercano y con calidez en sus saludos.</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.toneCard, tone === 'professional' && styles.toneCardActive]}
                        onPress={() => setTone('professional')}
                        activeOpacity={0.8}
                      >
                        <View style={styles.toneIconWrap}>
                          <Briefcase size={20} color={colors.brand.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.toneTitle, tone === 'professional' && styles.toneTitleActive]}>Serio</Text>
                          <Text style={styles.toneDesc}>Trato formal, profesional y enfocado en tareas empresariales.</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.toneCard, tone === 'direct' && styles.toneCardActive]}
                        onPress={() => setTone('direct')}
                        activeOpacity={0.8}
                      >
                        <View style={styles.toneIconWrap}>
                          <Zap size={20} color={colors.brand.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.toneTitle, tone === 'direct' && styles.toneTitleActive]}>Directo</Text>
                          <Text style={styles.toneDesc}>Trato conciso, al grano, optimizando la velocidad y respuestas.</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Realtime Chat Preview Bubble */}
                  <View style={styles.previewBox}>
                    <Text style={styles.previewBoxLabel}>Vista previa del trato del asistente</Text>
                    <View style={styles.chatBubbleContainer}>
                      <View style={styles.botIcon}>
                        <Bot size={18} color={colors.neutral.gray600} />
                      </View>
                      <View style={styles.chatBubble}>
                        <Text style={styles.chatBubbleText}>{getAssistantPreviewText()}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {step === 3 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Todo lo que puedes hacer aquí</Text>
                  <Text style={styles.subtitle}>
                    Familiarízate con las herramientas que potenciarán tu productividad.
                  </Text>

                  {/* List of Benefits */}
                  <Text style={styles.groupHeader}>Beneficios Clave</Text>
                  <View style={styles.listCard}>
                    <View style={styles.listItem}>
                      <Mail size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Correo unificado</Text>
                        <Text style={styles.listItemDesc}>Conecta Gmail y Outlook en un solo buzón inteligente.</Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <MessageCircle size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Chats y llamadas</Text>
                        <Text style={styles.listItemDesc}>Conversa, llama y haz videollamadas con tus equipos de trabajo.</Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <FileText size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Notas</Text>
                        <Text style={styles.listItemDesc}>Guarda, edita y organiza tus ideas y recordatorios diarios.</Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <Folder size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Archivos</Text>
                        <Text style={styles.listItemDesc}>Almacena, organiza y firma digitalmente todos tus documentos.</Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <Calendar size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Calendario</Text>
                        <Text style={styles.listItemDesc}>Programa y administra reuniones corporativas en segundos.</Text>
                      </View>
                    </View>
                    <View style={styles.listItem}>
                      <Sparkles size={22} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.listItemTitle}>Asistente de IA</Text>
                        <Text style={styles.listItemDesc}>Agiliza envíos de mails, notas y búsquedas con comandos de voz.</Text>
                      </View>
                    </View>
                  </View>

                  {/* Explanation of System Permissions (No systems prompts triggered here) */}
                  <Text style={styles.groupHeader}>Accesos Informativos (Opcionales)</Text>
                  <Text style={styles.permissionsNotice}>
                    Para habilitar todas las funciones, te explicamos qué accesos utilizaremos en la app y por qué:
                  </Text>

                  <View style={styles.listCard}>
                    <View style={styles.permissionItem}>
                      <Bell size={18} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Notificaciones</Text>
                        <Text style={styles.permissionDesc}>Te avisa sobre nuevos mensajes, llamadas entrantes o recordatorios de reuniones.</Text>
                      </View>
                    </View>
                    <View style={styles.permissionItem}>
                      <MapPin size={18} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Ubicación</Text>
                        <Text style={styles.permissionDesc}>Sirve para autocompletar tu dirección laboral o compartir ubicación real en chats.</Text>
                      </View>
                    </View>
                    <View style={styles.permissionItem}>
                      <Camera size={18} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Cámara</Text>
                        <Text style={styles.permissionDesc}>Para tomar fotos de perfil, realizar videollamadas y escanear tus documentos físicos.</Text>
                      </View>
                    </View>
                    <View style={styles.permissionItem}>
                      <Mic size={18} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Micrófono</Text>
                        <Text style={styles.permissionDesc}>Habilita las llamadas de voz, grabación de audios de chat y dictado por voz al asistente.</Text>
                      </View>
                    </View>
                    <View style={styles.permissionItem}>
                      <HardDrive size={18} color={colors.brand.primary} style={styles.listIcon} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.permissionTitle}>Almacenamiento</Text>
                        <Text style={styles.permissionDesc}>Para descargar archivos compartidos y adjuntar documentos desde tu dispositivo móvil.</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {step === 3 ? 'Comenzar' : 'Continuar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progressHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  backNavButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 8,
    marginBottom: 8,
  },
  backNavText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.brand.primary,
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  stepWrapper: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.neutral.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginTop: -12,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarButton: {
    marginRight: 16,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.neutral.gray100,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarActive: {
    backgroundColor: colors.brand.primary,
    borderColor: colors.brand.primary,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: colors.semantic.success,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCheckText: {
    color: colors.neutral.white,
    fontSize: 10,
    fontWeight: '900',
  },
  avatarPlaceholderText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.neutral.gray600,
    textTransform: 'uppercase',
  },
  avatarInfo: {
    flex: 1,
  },
  avatarInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  avatarInfoDesc: {
    fontSize: 12,
    color: colors.neutral.gray600,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  inputField: {
    backgroundColor: colors.neutral.gray50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.neutral.text,
    fontWeight: '500',
  },
  businessToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleButtons: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.gray100,
    padding: 3,
    borderRadius: 10,
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.gray600,
  },
  toggleBtnTextActive: {
    color: colors.neutral.text,
  },
  businessExpandedArea: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: colors.neutral.gray100,
    paddingTop: 20,
  },
  logoButton: {
    marginRight: 16,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.neutral.gray100,
    borderWidth: 2,
    borderColor: colors.neutral.gray300,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  logoPlaceholderText: {
    fontSize: 8,
    fontWeight: '700',
    color: colors.neutral.gray600,
    textTransform: 'uppercase',
  },
  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorCard: {
    flex: 1,
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectorCardActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
  },
  selectorCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray600,
  },
  selectorCardTextActive: {
    color: colors.brand.primary,
    fontWeight: '700',
  },
  selectorIconTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorIcon: {
    marginRight: 4,
  },
  toneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray200,
    borderRadius: 12,
    marginBottom: 10,
  },
  toneCardActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.neutral.white,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  toneIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toneTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  toneTitleActive: {
    color: colors.brand.primary,
  },
  toneDesc: {
    fontSize: 11,
    color: colors.neutral.gray600,
    lineHeight: 15,
  },
  previewBox: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  previewBoxLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chatBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  chatBubble: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    borderBottomLeftRadius: 2,
    padding: 12,
  },
  chatBubbleText: {
    fontSize: 13,
    color: colors.neutral.text,
    lineHeight: 18,
    fontWeight: '500',
  },
  groupHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  listCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  listIcon: {
    marginRight: 14,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  listItemDesc: {
    fontSize: 12,
    color: colors.neutral.gray600,
  },
  permissionsNotice: {
    fontSize: 13,
    color: colors.neutral.gray600,
    lineHeight: 18,
    marginBottom: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  permissionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral.text,
    marginBottom: 2,
  },
  permissionDesc: {
    fontSize: 11,
    color: colors.neutral.gray600,
    lineHeight: 15,
  },
  footerRow: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  primaryButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
