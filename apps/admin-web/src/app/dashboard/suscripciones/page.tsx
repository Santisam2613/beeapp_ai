'use client';

import { Wallet, TrendingUp, UserPlus, UserMinus, TrendingDown, Coins } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import KpiGrid, { type KpiItem } from '@/components/KpiGrid';
import ChartCard from '@/components/ChartCard';
import ChartLegend from '@/components/ChartLegend';
import ChartTooltip from '@/components/ChartTooltip';
import { SUBSCRIPTION_KPIS, REVENUE_SERIES, SUBSCRIPTIONS_FLOW_SERIES } from '@/mocks/metrics';
import { formatCurrencyCOP } from '@/utils/format';
import { CHART_COLORS, CHART_GRID_STROKE, CHART_AXIS_TICK, CHART_AXIS_LINE, CHART_CURSOR, formatMillionsTick } from '@/utils/chart';
import TransactionsSection from './TransactionsSection';
import PlansSection from './PlansSection';

export default function SuscripcionesPage() {
  const kpiItems: KpiItem[] = [
    { id: 'mes', icon: Wallet, label: 'Ingresos del mes', value: formatCurrencyCOP(SUBSCRIPTION_KPIS.ingresosMes), delta: { value: '+6.1% vs mes anterior', trend: 'up' } },
    { id: 'anio', icon: TrendingUp, label: 'Ingresos del año', value: formatCurrencyCOP(SUBSCRIPTION_KPIS.ingresosAnio), delta: { value: '+22% vs año anterior', trend: 'up' } },
    { id: 'altas', icon: UserPlus, label: 'Altas del mes', value: String(SUBSCRIPTION_KPIS.altas), delta: { value: '+9 vs mes anterior', trend: 'up' } },
    { id: 'cancelaciones', icon: UserMinus, label: 'Cancelaciones', value: String(SUBSCRIPTION_KPIS.cancelaciones), delta: { value: '-1 vs mes anterior', trend: 'down' } },
    { id: 'churn', icon: TrendingDown, label: 'Tasa de churn', value: `${SUBSCRIPTION_KPIS.churnRate}%`, delta: { value: '-0.3pp vs mes anterior', trend: 'up' } },
    { id: 'promedio', icon: Coins, label: 'Ingreso promedio', value: formatCurrencyCOP(SUBSCRIPTION_KPIS.ingresoPromedio) },
  ];

  return (
    <div>
      <div className="page-section">
        <KpiGrid items={kpiItems} />
      </div>

      <div className="page-section">
        <div className="charts-grid">
          <ChartCard title="Ingresos por mes" subtitle="Ingresos totales facturados">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_SERIES} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
                <XAxis dataKey="label" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={false} />
                <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} width={40} tickFormatter={formatMillionsTick} />
                <Tooltip content={<ChartTooltip valueFormatter={formatCurrencyCOP} />} cursor={CHART_CURSOR} />
                <Bar dataKey="value" name="Ingresos" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Altas vs. cancelaciones" subtitle="Movimiento mensual de suscripciones">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBSCRIPTIONS_FLOW_SERIES} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={CHART_GRID_STROKE} />
                  <XAxis dataKey="label" tick={CHART_AXIS_TICK} axisLine={CHART_AXIS_LINE} tickLine={false} />
                  <YAxis tick={CHART_AXIS_TICK} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={<ChartTooltip />} cursor={CHART_CURSOR} />
                  <Bar dataKey="altas" name="Altas" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                  <Bar dataKey="cancelaciones" name="Cancelaciones" fill={CHART_COLORS.negative} radius={[4, 4, 0, 0]} maxBarSize={16} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend
                items={[
                  { id: 'altas', label: 'Altas', color: CHART_COLORS.primary },
                  { id: 'cancelaciones', label: 'Cancelaciones', color: CHART_COLORS.negative },
                ]}
              />
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="page-section">
        <TransactionsSection />
      </div>

      <PlansSection />
    </div>
  );
}
