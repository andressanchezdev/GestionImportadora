// CreditAccountDetail · estado de cuenta de un cliente: métricas, abono y facturas
// ojo: el encabezado (nombre, NIT y cerrar) ahora lo pinta el panel derecho (DrawerHeader) con wallet.selectors (selectAccountDrawerMeta)
// conecta con: CreditAccountDrawer (le pasa el cliente), useCreditPayment (abonos)
import React from 'react'
import './CreditAccountDetail.css'
import { useCreditPayment } from '../../hooks/useCreditPayment'
import { CreditAccountMetrics } from './CreditAccountMetrics'
import { CreditPaymentForm } from '../billing/CreditPaymentForm'
import { CreditInvoiceList } from '../billing/CreditInvoiceList'
import type { CreditAccountDetailProps } from '../../types/wallet.account.types'

export const CreditAccountDetail: React.FC<CreditAccountDetailProps> = ({ customer }) => {
  const { paymentAmount, setPaymentAmount, successMessage, submitPayment } = useCreditPayment(customer.id)

  return (
    <div className="credit-drawer">
      <div className="credit-drawer-body">
        <CreditAccountMetrics usedCredit={customer.usedCredit} availableCredit={customer.availableCredit} />

        {/* Notificación de éxito */}
        {successMessage && <div className="credit-drawer-alert-success">{successMessage}</div>}

        {customer.usedCredit > 0 && (
          <CreditPaymentForm
            amount={paymentAmount}
            onAmountChange={setPaymentAmount}
            onSubmit={() => submitPayment()}
          />
        )}

        <CreditInvoiceList
          invoices={customer.invoices}
          onPayInvoice={(invoiceId, amount) => submitPayment(invoiceId, amount)}
        />
      </div>
    </div>
  )
}

export default CreditAccountDetail
