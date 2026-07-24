import { Check } from 'lucide-react';
import { MOCK_PLANS } from '@/mocks/plans';
import { formatCurrencyCOP, formatNumber } from '@/utils/format';

export default function PlansSection() {
  return (
    <div className="page-section">
      <span className="panel-card-title">Gestión de planes</span>
      <div className="plans-grid">
        {MOCK_PLANS.map((plan) => (
          <div key={plan.id} className="plan-manage-card">
            <div className="plan-manage-card-top">
              <span className="plan-manage-name">{plan.nombre}</span>
              <span className="plan-manage-dot" style={{ backgroundColor: plan.color }} />
            </div>

            <div>
              <span className="plan-manage-price">
                {plan.precioMensual === 0 ? 'Gratis' : formatCurrencyCOP(plan.precioMensual)}
              </span>
              {plan.precioMensual > 0 && <span className="plan-manage-price-period"> / mes</span>}
            </div>

            <p className="plan-manage-description">{plan.descripcion}</p>

            <div className="plan-manage-features">
              {plan.caracteristicas.map((feature) => (
                <div key={feature} className="plan-manage-feature-row">
                  <Check size={14} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="plan-manage-footer">
              <span className="plan-manage-active-count">{formatNumber(plan.usuariosActivos)} usuarios activos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
