// wallet.helpers · funciones puras de cartera (uso de cupo, monto del abono y reparto del pago)
// conecta con: CreditClientsTable, CreditAccountDrawer y wallet.slice (registerPayment)
// ojo: estas funciones antes estaban dentro de los componentes y del reducer
import type { CustomerCreditProfile } from '../types/wallet.types'

// porcentaje de cupo usado (0 si el cupo es 0, máximo 100)
export const getUsagePercentage = (used: number, limit: number): number => {
  if (limit <= 0) return 0
  return Math.min(100, Math.round((used / limit) * 100))
}

// nivel visual de la barra de uso: crítico desde 90%, alerta desde 70%
export const getUsageLevel = (pct: number): 'critical' | 'warning' | 'normal' => {
  if (pct >= 90) return 'critical'
  if (pct >= 70) return 'warning'
  return 'normal'
}

// convierte lo digitado en el abono a número; devuelve null si no es un monto válido
export const parsePaymentAmount = (raw: string): number | null => {
  const amount = parseFloat(raw.replace(/\D/g, ''))
  if (!amount || isNaN(amount) || amount <= 0) return null
  return amount
}

// aplica un abono al cliente: baja el saldo, reparte entre facturas y reevalúa el estado
// funciona sobre el borrador de immer (lo llama registerPayment en wallet.slice)
export const applyPaymentToCustomer = (
  customer: CustomerCreditProfile,
  amount: number,
  invoiceId?: string
): void => {
  // Reducir saldo adeudado y aumentar cupo disponible
  const effectivePayment = Math.min(amount, customer.usedCredit)
  customer.usedCredit -= effectivePayment
  customer.availableCredit = customer.creditLimit - customer.usedCredit
  customer.lastPaymentDate = new Date().toISOString().split('T')[0]
  customer.lastPaymentAmount = effectivePayment

  // Si se especificó una factura, aplicar a esa factura
  if (invoiceId) {
    const inv = customer.invoices.find((i) => i.id === invoiceId)
    if (inv) {
      inv.paidAmount += effectivePayment
      inv.pendingBalance = Math.max(0, inv.pendingBalance - effectivePayment)
      if (inv.pendingBalance <= 0) {
        inv.status = 'paid'
      }
    }
  } else {
    // Distribuir a las facturas más antiguas (aging)
    let remaining = effectivePayment
    for (const inv of customer.invoices) {
      if (inv.pendingBalance > 0 && remaining > 0) {
        const pay = Math.min(remaining, inv.pendingBalance)
        inv.paidAmount += pay
        inv.pendingBalance -= pay
        remaining -= pay
        if (inv.pendingBalance <= 0) {
          inv.status = 'paid'
        }
      }
    }
  }

  // Reevaluar estado del cliente si ya saldó la mora
  const hasOverdue = customer.invoices.some((i) => i.status === 'overdue' && i.pendingBalance > 0)
  if (!hasOverdue) {
    customer.creditStatus = 'upToDate'
  }
}
