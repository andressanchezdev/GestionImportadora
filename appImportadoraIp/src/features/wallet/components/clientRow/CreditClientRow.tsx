// CreditClientRow · fila de un cliente: datos, cupo, saldo, uso, estado y botón "Ver Estado"
// conecta con: wallet.slice (seleccionar cliente), wallet.helpers (uso de cupo); partes: CreditUsageBar y CreditStatusBadge; la pinta CreditClientsTable
import React from 'react'
import { formatCOP } from '@/global/helpers/format'
import { useAppDispatch } from '@/global/hooks/useRedux'
import { getUsagePercentage } from '../../helpers/wallet.helpers'
import { setSelectedCustomer } from '../../slices/wallet.slice'
import type { CreditClientRowProps } from '../../types/wallet.table.types'
import { CreditUsageBar } from './CreditUsageBar'
import { CreditStatusBadge } from './CreditStatusBadge'
import './CreditClientRow.css'

export const CreditClientRow: React.FC<CreditClientRowProps> = ({ customer: cust, isSelected }) => {
  const dispatch = useAppDispatch()
  const pct = getUsagePercentage(cust.usedCredit, cust.creditLimit)

  return (
    <tr
      className={`credit-table-row ${isSelected ? 'credit-table-row-selected' : ''}`}
      onClick={() => dispatch(setSelectedCustomer(cust.id))}
    >
      <td>
        <div className="credit-table-cust-business-name">{cust.businessName}</div>
        <div className="credit-table-cust-document">NIT: {cust.documentId}</div>
      </td>
      <td>
        <div className="credit-table-cust-contact">{cust.contactName}</div>
        <div className="credit-table-cust-city">{cust.city} · {cust.phone}</div>
      </td>
      <td className="credit-table-cust-currency credit-table-font-mono">{formatCOP(cust.creditLimit)}</td>
      <td className="credit-table-cust-currency credit-table-font-mono credit-table-font-semibold credit-table-text-rose">
        {formatCOP(cust.usedCredit)}
      </td>
      <td>
        <CreditUsageBar percentage={pct} />
      </td>
      <td className="credit-table-cust-currency credit-table-font-mono credit-table-text-emerald">
        {formatCOP(cust.availableCredit)}
      </td>
      <td>
        <CreditStatusBadge status={cust.creditStatus} />
      </td>
      <td className="credit-table-cell-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            dispatch(setSelectedCustomer(cust.id))
          }}
          className="credit-table-btn-detail"
        >
          Ver Estado →
        </button>
      </td>
    </tr>
  )
}

export default CreditClientRow
