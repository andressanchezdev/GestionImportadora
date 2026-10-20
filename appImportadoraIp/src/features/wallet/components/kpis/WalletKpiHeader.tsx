// WalletKpiHeader · tarjetas de totales de cartera (cupo, por cobrar, mora, clientes)
// conecta con: wallet.slice (clientes), global StatCard
// src/features/wallet/components/kpis/WalletKpiHeader.tsx
import React from 'react'
import './WalletKpiHeader.css'
// ojo: formatCOP ahora salen de global/helpers/format (antes estaban repetidas en cada componente)
import { formatCOP } from '@/global/helpers/format'
import { StatCard } from '@/global/components/UI/molecules/StatCard'
import { useAppSelector } from '@/global/hooks/useRedux'
// ojo: los totales ahora salen de wallet.selectors (antes se calculaban aquí con useMemo)
import { selectWalletKpis } from '../../selectors/wallet.selectors'

export const WalletKpiHeader: React.FC = () => {
  const { customers } = useAppSelector((state) => state.wallet)

  const kpis = useAppSelector(selectWalletKpis)

  return (
    <div className="wallet-kpi-grid">
      <StatCard
        title="Total Cartera por Cobrar"
        value={formatCOP(kpis.totalReceivable)}
        subtitle="Saldo corriente y vencido"
        badge={{ text: 'Activo', variant: 'indigo' }}
      />
      <StatCard
        title="Cartera en Mora"
        value={formatCOP(kpis.totalOverdue)}
        subtitle="Vencimiento mayor a 30 días"
        badge={{ text: 'Alerta', variant: 'rose' }}
        trend={{ value: 'Riesgo alto', positive: false }}
      />
      <StatCard
        title="Cupo Total Aprobado"
        value={formatCOP(kpis.totalLimit)}
        subtitle="Límite financiero global"
        badge={{ text: 'Cupos', variant: 'emerald' }}
      />
      <StatCard
        title="Clientes con Saldo Activo"
        value={`${kpis.activeClients} de ${customers.length}`}
        subtitle="Clientes con créditos vigentes"
        badge={{ text: 'Clientes', variant: 'slate' }}
      />
    </div>
  )
}

export default WalletKpiHeader
