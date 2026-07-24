import type { NetworkVisibility, PlanFeatureKey } from '@/mocks/types';

export const VISIBILITY_LABELS: Record<NetworkVisibility, string> = {
  publico: 'Público',
  privado: 'Privado',
  solo_equipo: 'Solo equipo',
};

export const PLAN_FEATURE_LABELS: Record<PlanFeatureKey, string> = {
  sinPublicidad: 'Sin publicidad',
  copiasNube: 'Copias de seguridad en la nube',
  chatsOcultos: 'Chats ocultos',
  firmaDigital: 'Firma digital',
  historialVersiones: 'Historial de versiones',
  catalogoAvanzado: 'Catálogo avanzado',
  perfilDestacado: 'Perfil destacado',
};
