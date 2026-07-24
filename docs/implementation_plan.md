# Reestructuración Arquitectónica del Panel Administrativo

## Hallazgos de la Auditoría

### Estado Actual
- **Build:** Compila correctamente (`next build` exitoso, 0 errores).
- **TypeScript:** Sin errores de tipos.

### Problemas Encontrados

| Problema | Detalle |
|----------|---------|
| **Arquitectura monolítica** | Todo el panel vive en `dashboard/page.tsx` (704 líneas). Cambia módulos con `activeModule` + renderizado condicional. No hay rutas reales ni URLs propias. |
| **Archivos gigantes** | `UsersModule.tsx` = 1,515 líneas. `SubscriptionsModule.tsx` = 845 líneas. `DashboardModule.tsx` = 716 líneas. Cada uno contiene JSX, lógica, y ~400 líneas de CSS inline con `<style jsx>`. |
| **Sin layout compartido** | No existe `layout.tsx` dentro de `/dashboard`. El sidebar, topbar y navegación están embebidos directamente en `page.tsx`. |
| **Mocks monolíticos** | Todo en un solo `adminData.ts` de 498 líneas: tipos, datos de usuarios, transacciones, KPIs, gráficas y planes mezclados. |
| **Sin ruta de detalle de usuario** | El detalle se muestra en un slideover modal dentro del mismo `UsersModule.tsx`. No hay ruta `/dashboard/usuarios/[id]`. |
| **CSS duplicado masivamente** | Estilos como `.filter-card`, `.pagination-bar`, `.modal-backdrop` se repiten casi idénticos entre UsersModule y SubscriptionsModule. |

### Lo que Funciona (a conservar la lógica)
- KPIs con selector de rango temporal (Dashboard)
- 4 gráficas Recharts (línea, barras, pie, barras horizontales)
- Tabla de usuarios con búsqueda, filtros, paginación y ordenamiento
- Detalle de usuario con banner de privacidad
- Tabla de transacciones con filtros
- Gestión visual de planes (BeeApp Gratuito / Plus)
- Sidebar responsive (hamburguesa en mobile)
- Notificaciones popover y menú de perfil admin

---

## Cambios Propuestos

### 1. Rutas Reales con App Router

Estructura de carpetas nueva:

```
src/app/dashboard/
├── layout.tsx              ← sidebar + topbar compartido (NUEVO)
├── page.tsx                ← Dashboard KPIs y gráficas (REESCRIBIR)
├── usuarios/
│   ├── page.tsx            ← Listado con tabla, filtros (NUEVO)
│   └── [id]/
│       └── page.tsx        ← Detalle de un usuario (NUEVO)
└── suscripciones/
    └── page.tsx            ← Suscripciones e ingresos (NUEVO)
```

Rutas resultantes:
- `/dashboard` - Resumen (KPIs y gráficas)
- `/dashboard/usuarios` - Listado de usuarios
- `/dashboard/usuarios/u1` - Detalle de un usuario
- `/dashboard/suscripciones` - Suscripciones e ingresos

Se **elimina** el renderizado condicional por estado. La navegación será por `<Link>` de Next.js con URL real.

---

### 2. Layout Compartido (`layout.tsx`)

Se extrae de `page.tsx` actual:
- **Sidebar** con logo, navegación (arreglo de datos), perfil admin y logout
- **Topbar** con título dinámico (basado en `usePathname()`), buscador, notificaciones y perfil dropdown
- **Área `{children}`** donde se renderiza cada página

El sidebar marcará el módulo activo comparando `pathname` con las rutas del arreglo NAV_ITEMS.

---

### 3. Componentes Reutilizables

```
src/components/
├── KpiCard.tsx            ← Tarjeta individual de KPI (~50 líneas)
├── KpiGrid.tsx            ← Grid de KPIs con loader (~40 líneas)
├── ChartCard.tsx          ← Wrapper para gráficas (~40 líneas)
├── DataTable.tsx          ← Tabla responsive (desktop tabla / mobile tarjetas) (~200 líneas)
├── FilterBar.tsx          ← Buscador + selectores de filtro (~100 líneas)
├── Pagination.tsx         ← Controles de paginación (~60 líneas)
├── StatusBadge.tsx        ← Badge de estado con dot de color (~30 líneas)
├── PlanBadge.tsx          ← Badge de plan (Gratuito/Plus) (~20 líneas)
├── SlidePanel.tsx         ← Panel lateral modal reutilizable (~60 líneas)
└── ActivityFeed.tsx       ← Lista de actividad reciente (~50 líneas)
```

> [!IMPORTANT]
> Cada archivo se mantiene por debajo de ~300 líneas. Los estilos CSS que se repiten se centralizan en `globals.css` con clases compartidas.

---

### 4. Mocks Separados por Dominio

```
src/mocks/
├── types.ts               ← Interfaces TypeScript (MockUser, MockTransaction, etc.)
├── users.ts               ← MOCK_USERS array
├── transactions.ts        ← MOCK_TRANSACTIONS array
├── metrics.ts             ← GET_MOCK_KPIS, datos de gráficas (growth, revenue, etc.)
├── plans.ts               ← MOCK_PLANS array
└── activities.ts          ← MOCK_ACTIVITIES array
```

---

### 5. CSS Centralizado

Mover todos los estilos compartidos de los `<style jsx>` a `globals.css` bajo secciones organizadas:
- Layout (admin-layout, sidebar, topbar)
- KPI cards
- Tablas y filtros
- Paginación
- Modales y paneles laterales
- Badges y estados
- Gráficas
- Responsive breakpoints

Los archivos de componentes y páginas quedarán sin `<style jsx>`, usando solo las clases de `globals.css`.

---

### 6. Detalle de Usuario como Ruta

El detalle del usuario pasa de ser un modal/slideover dentro de UsersModule a una página dedicada `/dashboard/usuarios/[id]`:
- Recibe el `id` del usuario como param de la URL
- Busca el usuario en los mocks por ID
- Muestra toda la información (registro, onboarding, métricas, integraciones, historial de plan)
- Mantiene el banner de privacidad prominente
- Botón "Volver" que regresa a `/dashboard/usuarios`

---

## Archivos que se Eliminan

| Archivo | Razón |
|---------|-------|
| `src/features/dashboard/DashboardModule.tsx` | Se reescribe como `src/app/dashboard/page.tsx` usando componentes |
| `src/features/dashboard/UsersModule.tsx` | Se divide en `src/app/dashboard/usuarios/page.tsx` + `src/app/dashboard/usuarios/[id]/page.tsx` + componentes |
| `src/features/dashboard/SubscriptionsModule.tsx` | Se reescribe como `src/app/dashboard/suscripciones/page.tsx` usando componentes |
| `src/mocks/adminData.ts` | Se divide en archivos por dominio |

---

## Plan de Verificación

### Compilación
- `npm run type-check` sin errores
- `npm run build` sin errores, todas las rutas generadas

### Rutas Verificadas
- `/dashboard` renderiza KPIs y gráficas
- `/dashboard/usuarios` renderiza tabla filtrable
- `/dashboard/usuarios/u1` renderiza detalle del usuario
- `/dashboard/suscripciones` renderiza transacciones y planes
- Sidebar marca activo el módulo correcto por ruta
- Navegación con botones del navegador (back/forward) funciona

### Archivos
- Ningún archivo supera ~300 líneas
- Zero duplicación de CSS entre módulos
- Mocks separados por dominio y tipados
