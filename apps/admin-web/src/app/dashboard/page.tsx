'use client';

import { useMemo, useState } from 'react';
import { Users, UserCheck, UserPlus, CreditCard, Wallet, HardDrive } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import KpiGrid, { type KpiItem } from '@/components/KpiGrid';
import ChartCard from '@/components/ChartCard';
import ChartTooltip from '@/components/ChartTooltip';
import DataTable, { type DataTableColumn } from '@/components/DataTable';
import ActivityFeed from '@/components/ActivityFeed';
import PlanBadge from '@/components/PlanBadge';
import StatusBadge from '@/components/StatusBadge';
import { DASHBOARD_KPIS, USER_GROWTH_SERIES, REVENUE_SERIES, PLAN_DISTRIBUTION, MODULE_USAGE_SERIES } from '@/mocks/metrics';
import { MOCK_USERS } from '@/mocks/users';
import { MOCK_ACTIVITIES } from '@/mocks/activities';
import type { AdminUser } from '@/mocks/types';
import { formatCurrencyCOP, formatNumber, formatDate } from '@/utils/format';

const RANGE_OPTIONS = [
  { value: '3', label: 'Últimos 3 meses' },
  { value: '6', label: 'Últimos 6 meses' },
  { value: '7', label: 'Todo el periodo' },
];

const RECENT_USERS_COLUMNS: DataTableColumn<AdminUser>[] = [
  {
    key: 'usuario',
    header: 'Usuario',
    render: (row) => (
      <div className="table-user-cell">
        <div className="table-user-avatar">{row.iniciales}</div>
        <div className="table-user-name-col">
          <span className="table-user-name">{row.nombreCompleto}</span>
          <span className="table-user-email">{row.email}</span>
        </div>
      </div>
    ),
  },
  { key: 'plan', header: 'Plan', render: (row) => <PlanBadge planId={row.planId} /> },
  { key: 'estado', header: 'Estado', render: (row) => <StatusBadge status={row.estado} />, hideOnMobile: true },
  { key: 'fecha', header: 'Registro', render: (row) => formatDate(row.fechaRegistro), align: 'right' },
];

export default function DashboardPage() {
  const [range, setRange] = useState('7');
  const months = Number(range);

  const growthData = useMemo(() => USER_GROWTH_SERIES.slice(-months), [months]);
  const revenueData = useMemo(() => REVENUE_SERIES.slice(-months), [months]);

  const recentUsers = useMemo(
    () =>
      [...MOCK_USERS]
        .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
        .slice(0, 5),
    []
  );

  const kpiItems: KpiItem[] = [
    { id: 'total', icon: Users, label: 'Usuarios totales', value: formatNumber(DASHBOARD_KPIS.usuariosTotales), delta: { value: '+5.8% vs mes anterior', trend: 'up' } },
    { id: 'activos', icon: UserCheck, label: 'Usuarios activos', value: formatNumber(DASHBOARD_KPIS.usuariosActivos), delta: { value: '+4.2% vs mes anterior', trend: 'up' } },
    { id: 'nuevos', icon: UserPlus, label: 'Nuevos registros', value: formatNumber(DASHBOARD_KPIS.nuevosRegistros), delta: { value: '+18% vs mes anterior', trend: 'up' } },
    { id: 'subs', icon: CreditCard, label: 'Suscripciones activas', value: formatNumber(DASHBOARD_KPIS.suscripcionesActivas), delta: { value: '+2.4% vs mes anterior', trend: 'up' } },
    { id: 'ingresos', icon: Wallet, label: 'Ingresos del mes', value: formatCurrencyCOP(DASHBOARD_KPIS.ingresosMes), delta: { value: '+6.1% vs mes anterior', trend: 'up' } },
    { id: 'storage', icon: HardDrive, label: 'Almacenamiento consumido', value: `${DASHBOARD_KPIS.almacenamientoConsumidoGB.toFixed(1)} GB`, delta: { value: 'Estable', trend: 'neutral' } },
  ];

  return (
    <div>
      <div className="page-toolbar">
        <div className="page-toolbar-heading">
          <span className="page-toolbar-title">Resumen general</span>
          <span className="page-toolbar-subtitle">Datos simulados con fines de maquetación</span>
        </div>
        <select className="page-select" value={range} onChange={(event) => setRange(event.target.value)}>
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="page-section">
        <KpiGrid items={kpiItems} />
      </div>

      <div className="page-section">
        <div className="charts-grid">
          <ChartCard title="Crecimiento de usuarios" subtitle="Usuarios totales por mes">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#ADB5BD' }} axisLine={{ stroke: '#E9ECEF' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#ADB5BD' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip content={<ChartTooltip valueFormatter={formatNumber} />} />
                <Line type="monotone" dataKey="value" name="Usuarios" stroke="#6025d2" strokeWidth={2} dot={{ r: 4, fill: '#6025d2', stroke: '#FFFFFF', strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Ingresos por mes" subtitle="Ingresos totales facturados">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#ADB5BD' }} axisLine={{ stroke: '#E9ECEF' }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#ADB5BD' }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip content={<ChartTooltip valueFormatter={formatCurrencyCOP} />} cursor={{ fill: '#FAF5FF' }} />
                <Bar dataKey="value" name="Ingresos" fill="#6025d2" radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribución por plan" subtitle="Usuarios activos por tipo de plan">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PLAN_DISTRIBUTION} dataKey="valor" nameKey="nombre" innerRadius={54} outerRadius={82} paddingAngle={2} label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} isAnimationActive={false}>
                    {PLAN_DISTRIBUTION.map((entry) => (
                      <Cell key={entry.planId} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip valueFormatter={formatNumber} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {PLAN_DISTRIBUTION.map((entry) => (
                  <div key={entry.planId} className="chart-legend-item">
                    <span className="chart-legend-dot" style={{ backgroundColor: entry.color }} />
                    <span className="chart-legend-label">{entry.nombre}</span>
                    <span className="chart-legend-value">{formatNumber(entry.valor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Uso de módulos" subtitle="% de usuarios activos por módulo">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MODULE_USAGE_SERIES} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="#F1F3F5" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#ADB5BD' }} axisLine={false} tickLine={false} unit="%" />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 11.5, fill: '#495057', fontWeight: 650 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip content={<ChartTooltip valueFormatter={(v) => `${v}%`} />} cursor={{ fill: '#FAF5FF' }} />
                <Bar dataKey="value" name="Uso" fill="#6025d2" radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Últimos registros</span>
          </div>
          <DataTable columns={RECENT_USERS_COLUMNS} data={recentUsers} keyExtractor={(row) => row.id} />
        </div>

        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Actividad reciente</span>
          </div>
          <ActivityFeed activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}
