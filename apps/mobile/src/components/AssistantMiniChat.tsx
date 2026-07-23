import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { colors } from '@beeapp/design-system';
import { X, Send, Mic, Sparkles } from 'lucide-react-native';

interface AssistantMiniChatProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AssistantMiniChat({ visible, onClose }: AssistantMiniChatProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [inputText, setInputText] = useState('');
  
  // Custom mock messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '¡Hola! Soy BeeAI, tu asistente virtual. ¿En qué puedo colaborar contigo hoy?' },
    { id: 2, sender: 'bot', text: 'Puedo ayudarte a organizar tus correos, agendar citas en tu calendario o buscar documentos de tu negocio.' }
  ]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 100,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMessage = { id: Date.now(), sender: 'user', text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Simulate bot typing response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: '¡Excelente consulta! Esto es un simulador de IA. Próximamente procesaré tus solicitudes reales en el espacio de trabajo.' }
      ]);
    }, 1000);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop Tap to Close */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet Body */}
        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            style={styles.sheetContent}
          >
            {/* Handle bar indicator */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <View style={styles.aiBadge}>
                  <Sparkles size={16} color={colors.neutral.white} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>BeeAI</Text>
                  <Text style={styles.headerSubtitle}>Asistente Activo</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <X size={20} color={colors.neutral.gray600} />
              </TouchableOpacity>
            </View>

            {/* Chat Conversation Area */}
            <ScrollView
              style={styles.chatArea}
              contentContainerStyle={styles.chatScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {messages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.messageWrap,
                    msg.sender === 'user' ? styles.messageUserWrap : styles.messageBotWrap,
                  ]}
                >
                  {msg.sender === 'bot' && (
                    <View style={styles.avatarMini}>
                      <Text style={styles.avatarMiniText}>🤖</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        msg.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextBot,
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Suggestion Chips */}
            <View style={styles.suggestionsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScroll}>
                <TouchableOpacity style={styles.chip} onPress={() => setInputText('Agenda una reunión')}>
                  <Text style={styles.chipText}>📅 Agenda una reunión</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => setInputText('Crea una nota corporativa')}>
                  <Text style={styles.chipText}>📝 Crea una nota</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.chip} onPress={() => setInputText('Redacta un correo electrónico')}>
                  <Text style={styles.chipText}>✉️ Redacta un correo</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Input Bar */}
            <View style={styles.inputBar}>
              <TextInput
                style={styles.textInput}
                placeholder="Pregúntale a BeeAI..."
                placeholderTextColor={colors.neutral.gray500}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
                <Mic size={20} color={colors.neutral.gray600} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSend}
                disabled={!inputText.trim()}
                activeOpacity={0.8}
              >
                <Send size={18} color={colors.neutral.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 46, 0.4)',
  },
  sheet: {
    height: SCREEN_HEIGHT * 0.65,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    overflow: 'hidden',
  },
  sheetContent: {
    flex: 1,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.neutral.gray300,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: colors.neutral.gray100,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.neutral.text,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.semantic.success,
    fontWeight: '600',
  },
  closeButton: {
    padding: 6,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 10,
  },
  chatArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatScrollContent: {
    paddingVertical: 20,
  },
  messageWrap: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageUserWrap: {
    justifyContent: 'flex-end',
  },
  messageBotWrap: {
    justifyContent: 'flex-start',
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarMiniText: {
    fontSize: 14,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: colors.brand.primary,
    borderBottomRightRadius: 2,
  },
  bubbleBot: {
    backgroundColor: colors.neutral.gray100,
    borderBottomLeftRadius: 2,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: colors.neutral.white,
    fontWeight: '500',
  },
  bubbleTextBot: {
    color: colors.neutral.text,
  },
  suggestionsRow: {
    paddingVertical: 10,
    backgroundColor: colors.neutral.white,
  },
  suggestionsScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    backgroundColor: colors.neutral.gray50,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    borderTopWidth: 1,
    borderColor: colors.neutral.gray100,
    backgroundColor: colors.neutral.white,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.neutral.gray50,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.neutral.text,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    marginRight: 8,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.gray400,
  },
});
