// CreditStatusBadge · etiqueta del estado de crédito del cliente (al día, alerta, mora o bloqueado)
// conecta con: CreditClientRow (le pasa el estado); el texto y la variante salen de wallet.constants (CREDIT_STATUS_BADGES)
import React from 'react'
import { CREDIT_STATUS_BADGES } from '../../constants/wallet.constants'
import type { CreditStatusBadgeProps } from '../../types/wallet.table.types'
import './CreditStatusBadge.css'

export const CreditStatusBadge: React.FC<CreditStatusBadgeProps> = ({ status }) => {
  const badge = CREDIT_STATUS_BADGES[status]
  return <span className={`credit-table-badge credit-table-badge-${badge.variant}`}>{badge.label}</span>
}

export default CreditStatusBadge
