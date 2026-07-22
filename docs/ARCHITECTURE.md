# Arquitectura General - BeeApp AI Monorepo

## 1. Visión General del Ecosistema

**BeeApp AI** es un ecosistema de comunicación y productividad empresarial estructurado como un monorepo administrado con **pnpm workspaces** y **Turborepo**.

El ecosistema está dividido de forma estricta en dos aplicaciones con propósitos e interfaces totalmente independientes, compartiendo un núcleo común de diseño y tipos.

```
beeapp/
 ├── apps/
 │    ├── mobile/        # App Móvil (Usuarios Finales) - Expo + Expo Router
 │    └── admin-web/     # Panel Web Admin (Administradores) - Next.js (App Router)
 ├── packages/
 │    ├── design-system/ # Design Tokens, Temas y Componentes de UI Compartidos
 │    ├── shared-types/  # Tipos e Interfaces de TypeScript Compartidos
 │    └── config/        # Configuraciones base de TypeScript y Linter
 └── docs/
      ├── ARCHITECTURE.md
      └── ROADMAP.md
```

---

## 2. Diferencia entre Aplicaciones y Elección Tecnológica

| Aplicación | Público Objetivo | Stack Tecnológico | Razón de Elección |
| :--- | :--- | :--- | :--- |
| **App Móvil (`apps/mobile`)** | Usuarios finales de la empresa | **React Native + Expo (SDK reciente) + Expo Router + TypeScript** | Proporciona rendimiento nativo en iOS y Android, compilación rápida, soporte web multiplataforma y enrutamiento basado en archivos sencillo e intuitivo con Expo Router. |
| **Panel Web Admin (`apps/admin-web`)** | Exclusivamente administradores y supervisores de la plataforma | **Next.js (App Router) + TypeScript** | Plataforma de grado empresarial para escritorios con soporte nativo para Server-Side Rendering (SSR), Server Components, alta seguridad en la gestión de tokens administrativos y renderizado rápido de tableros de control complejos. |

---

## 3. Estrategia de Paquetes Compartidos (`packages/`)

### A. `@beeapp/design-system`
- **Ubicación:** `packages/design-system`
- **Contenido:**
  - `tokens/`: Tokens atómicos de diseño (`colors.ts`, `typography.ts`, `spacing.ts`, `radii.ts`, `shadows.ts`).
  - `theme/`: Esquemas de color y tema (`light.ts`, `dark.ts`).
  - `components/`: Componentes agnósticos compartidos de UI (en fases futuras).
- **Importación:** Tanto `apps/mobile` como `apps/admin-web` consumen directamente los tokens y temas vía `@beeapp/design-system`.

### B. `@beeapp/shared-types`
- **Ubicación:** `packages/shared-types`
- **Contenido:** Tipos globales TypeScript (modelos de usuario, estados, roles, respuestas de API y parámetros de paginación).
- **Garantía:** Asegura consistencia de datos entre el panel web administrativo y la aplicación móvil.

---

## 4. Mapeo de Integraciones Futuras por Aplicación

En esta fase de arquitectura **NO se han instalado ni integrado SDKs**. La asignación planificada de servicios futuros es la siguiente:

### App Móvil (`apps/mobile` - Usuarios)
- **Agora SDK:** Llamadas de voz y video individual / grupal (espacio reservado).
- **OneSignal SDK:** Notificaciones push, email de alertas y SMS (espacio reservado).
- **Supabase / Backend (a definir):** Autenticación de usuarios, base de datos en tiempo real y almacenamiento.
- **OpenAI:** Asistente inteligente y automatizaciones dentro del chat/notas.
- **Mapas & Geolocalización:** Rastreo de ubicación y check-ins para usuarios.
- **Pagos / Pasarela de Pago:** Suscripciones y servicios transaccionales (BeeServices).

### Panel Web Admin (`apps/admin-web` - Administradores)
- **Consumo de Backend Central:** Conexión segura para consultas avanzadas, métricas en tiempo real y administración global.
- **Módulo de Reportes & Analítica:** Generación y descarga de reportes ejecutivos.
- **Gestión de Suscripciones y Auditoría:** Supervisión de roles, licencias, registros de seguridad y políticas de uso.
