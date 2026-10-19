// src/features/cartera/components/CarteraKPIHeader.tsx
import React, { useMemo } from 'react'
import { StatCard } from '@/global/components/UI/molecules/StatCard'
import { useAppSelector } from '@/app/store/store'

export const CarteraKPIHeader: React.FC = () => {
  const { customers } = useAppSelector((state) => state.cartera)

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const kpis = useMemo(() => {
    const totalLimit = customers.reduce((acc, c) => acc + c.creditLimit, 0)
    const totalReceivable = customers.reduce((acc, c) => acc + c.usedCredit, 0)
    const totalOverdue = customers
      .filter((c) => c.creditStatus === 'mora_60' || c.creditStatus === 'bloqueado')
      .reduce((acc, c) => acc + c.usedCredit, 0)
    const activeClients = customers.filter((c) => c.usedCredit > 0).length

    return {
      totalLimit,
      totalReceivable,
      totalOverdue,
      activeClients,
    }
  }, [customers])

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginBottom: '1rem',
      }}
    >
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

export default CarteraKPIHeader
