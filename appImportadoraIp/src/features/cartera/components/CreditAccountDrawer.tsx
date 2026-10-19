// src/features/cartera/components/CreditAccountDrawer.tsx
import React, { useState } from 'react'
import './CreditAccountDrawer.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import {
  setAccountDrawerOpen,
  registerPayment,
} from '../slices/cartera.slice'
import walletIcon from '@/assets/icons/wallet.svg'

export const CreditAccountDrawer: React.FC = () => {
  const dispatch = useAppDispatch()
  const { customers, selectedCustomerId } = useAppSelector(
    (state) => state.cartera
  )
  const [paymentAmount, setPaymentAmount] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  if (!selectedCustomer) {
    return (
      <div className="credit-drawer-empty">
        <img src={walletIcon} alt="" className="credit-drawer-empty-icon" />
        <p className="credit-drawer-empty-text">Ningún cliente seleccionado</p>
        <span className="credit-drawer-empty-hint">
          Haz clic en cualquier cliente de la tabla para ver su estado de cuenta y registrar pagos.
        </span>
      </div>
    )
  }

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val)
  }

  const handleRegisterPayment = (invoiceId?: string, fullAmount?: number) => {
    const amount = fullAmount ?? parseFloat(paymentAmount.replace(/\D/g, ''))
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Por favor digita un monto válido a abonar.')
      return
    }

    dispatch(
      registerPayment({
        customerId: selectedCustomer.id,
        amount,
        invoiceId,
      })
    )

    setPaymentAmount('')
    setSuccessMessage(`¡Abono de ${formatCOP(amount)} registrado con éxito!`)
    setTimeout(() => setSuccessMessage(null), 4000)
  }

  return (
    <div className="credit-drawer">
      {/* Header */}
      <div className="credit-drawer-header">
        <div>
          <span className="credit-drawer-tag">Estado de Cuenta</span>
          <h3 className="credit-drawer-title">{selectedCustomer.businessName}</h3>
          <span className="credit-drawer-sub">NIT: {selectedCustomer.documentId}</span>
        </div>
        <button
          type="button"
          onClick={() => dispatch(setAccountDrawerOpen(false))}
          className="credit-drawer-close-btn"
          title="Cerrar panel"
        >
          ✕
        </button>
      </div>

      <div className="credit-drawer-body">
        {/* Banner de Saldo y Cupo */}
        <div className="credit-drawer-metrics-card">
          <div className="metric-col">
            <span className="metric-label">Saldo Adeudado</span>
            <span className="metric-value-debt text-rose">
              {formatCOP(selectedCustomer.usedCredit)}
            </span>
          </div>
          <div className="metric-col">
            <span className="metric-label">Cupo Disponible</span>
            <span className="metric-value-avail text-emerald">
              {formatCOP(selectedCustomer.availableCredit)}
            </span>
          </div>
        </div>

        {/* Notificación de éxito */}
        {successMessage && (
          <div className="credit-drawer-alert-success">{successMessage}</div>
        )}

        {/* Formulario de Abono Rápido */}
        {selectedCustomer.usedCredit > 0 && (
          <div className="credit-drawer-payment-card">
            <h4 className="payment-card-title">Registrar Abono / Pago</h4>
            <div className="payment-input-group">
              <span className="payment-currency-prefix">$</span>
              <input
                type="number"
                placeholder="Digitar valor en COP"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="payment-input"
              />
              <button
                type="button"
                onClick={() => handleRegisterPayment()}
                className="payment-submit-btn"
              >
                Abonar
              </button>
            </div>
            <span className="payment-hint">
              El abono se aplicará automáticamente a la factura más antigua.
            </span>
          </div>
        )}

        {/* Facturas Pendientes */}
        <div className="credit-drawer-invoices-section">
          <h4 className="invoices-section-title">
            Facturas Pendientes ({selectedCustomer.invoices.filter((i) => i.pendingBalance > 0).length})
          </h4>

          {selectedCustomer.invoices.length > 0 ? (
            <div className="invoices-list">
              {selectedCustomer.invoices.map((inv) => (
                <div key={inv.id} className="invoice-item-card">
                  <div className="invoice-item-header">
                    <div>
                      <span className="invoice-num">{inv.invoiceNumber}</span>
                      <span className="invoice-order">({inv.orderNumber})</span>
                    </div>
                    <span
                      className={`invoice-status-chip ${
                        inv.status === 'vencida' ? 'status-vencida' : 'status-vigente'
                      }`}
                    >
                      {inv.status === 'vencida'
                        ? `Vencida (${inv.daysOverdue}d)`
                        : 'Vigente'}
                    </span>
                  </div>

                  <div className="invoice-item-dates">
                    <span>Emisión: {inv.issueDate}</span>
                    <span>Vence: {inv.dueDate}</span>
                  </div>

                  <div className="invoice-item-balances">
                    <div className="balance-row">
                      <span>Total Factura:</span>
                      <strong>{formatCOP(inv.totalAmount)}</strong>
                    </div>
                    <div className="balance-row">
                      <span>Saldo Pendiente:</span>
                      <strong className="text-rose">
                        {formatCOP(inv.pendingBalance)}
                      </strong>
                    </div>
                  </div>

                  {inv.pendingBalance > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRegisterPayment(inv.id, inv.pendingBalance)}
                      className="invoice-pay-btn"
                    >
                      Pagar Total Factura ({formatCOP(inv.pendingBalance)})
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="invoices-empty">
              <span>Este cliente se encuentra al día, no tiene facturas pendientes.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreditAccountDrawer
