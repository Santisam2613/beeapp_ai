import type { Plan } from './types';

export const MOCK_PLANS: Plan[] = [
  {
    id: 'free',
    nombre: 'Free',
    precioMensual: 0,
    precioAnual: 0,
    descripcion: 'Acceso básico a mensajería y funciones esenciales.',
    caracteristicas: ['Mensajería 1 a 1', 'Hasta 3 grupos', '1 GB de almacenamiento'],
    usuariosActivos: 512,
    color: '#ADB5BD',
  },
  {
    id: 'plus',
    nombre: 'Plus',
    precioMensual: 9900,
    precioAnual: 99000,
    descripcion: 'Ideal para equipos pequeños que necesitan más capacidad.',
    caracteristicas: ['Grupos ilimitados', 'Videollamadas grupales', '20 GB de almacenamiento'],
    usuariosActivos: 348,
    color: '#7C3AED',
  },
  {
    id: 'pro',
    nombre: 'Pro',
    precioMensual: 24900,
    precioAnual: 249000,
    descripcion: 'Para empresas en crecimiento con necesidades avanzadas.',
    caracteristicas: ['Canales por departamento', 'Asistente IA', '100 GB de almacenamiento'],
    usuariosActivos: 196,
    color: '#6025d2',
  },
  {
    id: 'enterprise',
    nombre: 'Enterprise',
    precioMensual: 59900,
    precioAnual: 599000,
    descripcion: 'Solución completa con soporte dedicado y almacenamiento ampliado.',
    caracteristicas: ['SSO y auditoría avanzada', 'Soporte prioritario 24/7', 'Almacenamiento ilimitado'],
    usuariosActivos: 74,
    color: '#5B2CD9',
  },
];
