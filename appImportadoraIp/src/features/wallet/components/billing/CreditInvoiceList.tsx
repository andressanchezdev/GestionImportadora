// CreditInvoiceList · sección de facturas pendientes del cliente (lista o mensaje de "al día")
// conecta con: CreditAccountDetail (facturas y acción de pagar); pinta una CreditInvoiceCard por factura
import React from 'react'
import { CreditInvoiceCard } from './CreditInvoiceCard'
import type { CreditInvoiceListProps } from '../../types/wallet.account.types'
import './CreditInvoiceList.css'

export const CreditInvoiceList: React.FC<CreditInvoiceListProps> = ({ invoices, onPayInvoice }) => {
  return (
    /* Facturas Pendientes */
    <div className="credit-drawer-invoices-section">
      <h4 className="credit-drawer-invoices-section-title">
        Facturas Pendientes ({invoices.filter((i) => i.pendingBalance > 0).length})
      </h4>

      {invoices.length > 0 ? (
        <div className="credit-drawer-invoices-list">
          {invoices.map((inv) => (
            <CreditInvoiceCard key={inv.id} invoice={inv} onPay={onPayInvoice} />
          ))}
        </div>
      ) : (
        <div className="credit-drawer-invoices-empty">
          <span>Este cliente se encuentra al día, no tiene facturas pendientes.</span>
        </div>
      )}
    </div>
  )
}

export default CreditInvoiceList
