// CreditAccountMetrics · banner con el saldo adeudado y el cupo disponible del cliente
// conecta con: CreditAccountDetail (le pasa los dos valores); formato de global/helpers/format
import React from 'react'
import { formatCOP } from '@/global/helpers/format'
import type { CreditAccountMetricsProps } from '../../types/wallet.account.types'
import './CreditAccountMetrics.css'

export const CreditAccountMetrics: React.FC<CreditAccountMetricsProps> = ({ usedCredit, availableCredit }) => {
  return (
    /* Banner de Saldo y Cupo */
    <div className="credit-drawer-metrics-card">
      <div className="credit-drawer-metric-col">
        <span className="credit-drawer-metric-label">Saldo Adeudado</span>
        <span className="credit-drawer-metric-value-debt credit-drawer-text-rose">
          {formatCOP(usedCredit)}
        </span>
      </div>
      <div className="credit-drawer-metric-col">
        <span className="credit-drawer-metric-label">Cupo Disponible</span>
        <span className="credit-drawer-metric-value-avail credit-drawer-text-emerald">
          {formatCOP(availableCredit)}
        </span>
      </div>
    </div>
  )
}

export default CreditAccountMetrics
