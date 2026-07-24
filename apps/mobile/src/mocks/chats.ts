/**
 * Datos mock del módulo de Chat.
 * Extraídos de app/(main)/chat/ sin modificar su contenido.
 */

export const MOCK_CHATS = [
  {
    id: '1',
    name: 'Carlos Mendoza',
    lastMessage: 'Claro, nos vemos en la tarde para revisar la propuesta de BeeApp.',
    time: '14:32',
    unreadCount: 2,
    isGroup: false,
    status: 'read' as const,
    online: true,
    isPinned: true,
    isMuted: false,
  },
  {
    id: '2',
    name: 'Equipo de Desarrollo 🐝',
    lastMessage: 'Santiago: Acabo de subir el patch de expo-router a GitHub.',
    time: '12:15',
    unreadCount: 0,
    isGroup: true,
    status: 'read' as const,
    online: false,
    isPinned: true,
    isMuted: true,
  },
  {
    id: '3',
    name: 'Mariana Gómez',
    lastMessage: '¿Lograste firmar el documento del contrato?',
    time: 'Ayer',
    unreadCount: 0,
    isGroup: false,
    status: 'delivered' as const,
    online: false,
    isPinned: false,
    isMuted: false,
  },
  {
    id: '4',
    name: 'Alejandro Reyes (Soporte)',
    lastMessage: 'Tu solicitud #1425 ha sido resuelta con éxito.',
    time: 'Ayer',
    unreadCount: 0,
    isGroup: false,
    status: 'sent' as const,
    online: true,
    isPinned: false,
    isMuted: false,
  },
];

export const MOCK_STORIES = [
  { id: 'tu', name: 'Tu estado', hasActive: false, isUser: true },
  { id: '1', name: 'Carlos', hasActive: true, initials: 'C' },
  { id: '2', name: 'Mariana', hasActive: true, initials: 'M' },
  { id: '3', name: 'Alejandro', hasActive: false, initials: 'A' },
  { id: '4', name: 'Laura', hasActive: true, initials: 'L' },
  { id: '5', name: 'Felipe', hasActive: false, initials: 'F' },
];

export interface ChatMessage {
  id: number;
  senderName?: string;
  isUser: boolean;
  type: 'text' | 'image' | 'file' | 'audio';
  text?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
  status: 'sent' | 'delivered' | 'read';
  time: string;
  replyTo?: {
    sender: string;
    text: string;
  };
}

export const MOCK_CONVERSATION_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    senderName: 'Carlos Mendoza',
    isUser: false,
    type: 'text' as const,
    text: 'Hola Santiago, ¿cómo estás? Te escribo para confirmar la reunión.',
    time: '12:00',
    status: 'read' as const,
  },
  {
    id: 2,
    isUser: true,
    type: 'text' as const,
    text: '¡Hola Carlos! Todo bien por aquí. Sí, claro, confírmame la hora.',
    time: '12:02',
    status: 'read' as const,
    replyTo: {
      sender: 'Carlos Mendoza',
      text: 'Hola Santiago, ¿cómo estás? Te escribo para confirmar la reunión.',
    },
  },
  {
    id: 3,
    senderName: 'Carlos Mendoza',
    isUser: false,
    type: 'file' as const,
    fileName: 'Propuesta_Comercial_BeeApp.pdf',
    fileSize: '1.4 MB',
    time: '12:05',
    status: 'read' as const,
  },
  {
    id: 4,
    isUser: true,
    type: 'audio' as const,
    audioDuration: '0:14',
    time: '12:08',
    status: 'read' as const,
  },
  {
    id: 5,
    senderName: 'Carlos Mendoza',
    isUser: false,
    type: 'image' as const,
    mediaUrl: 'https://picsum.photos/400/300',
    text: 'Esta es la captura de los avances del diseño que te comentaba.',
    time: '12:10',
    status: 'read' as const,
  },
];
