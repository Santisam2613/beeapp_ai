import { Mail, FileText, Users, Folder, Calendar } from 'lucide-react-native';

// Módulos disponibles para los accesos rápidos personalizables del home
export const MODULES_POOL = [
  { id: 'mail', name: 'Correos', icon: Mail, bgColor: '#EBF5FF', iconColor: '#1E88E5' },
  { id: 'notes', name: 'Notas', icon: FileText, bgColor: '#FEF3C7', iconColor: '#D97706' },
  { id: 'contacts', name: 'Contactos', icon: Users, bgColor: '#FEE2E2', iconColor: '#DC2626' },
  { id: 'files', name: 'Almacenamiento', icon: Folder, bgColor: '#ECFDF5', iconColor: '#059669' },
  { id: 'calendar', name: 'Calendario', icon: Calendar, bgColor: '#F3E8FF', iconColor: '#7C3AED' },
];
