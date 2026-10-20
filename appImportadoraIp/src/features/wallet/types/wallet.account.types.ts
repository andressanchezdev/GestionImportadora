// wallet.account.types · props de las partes del estado de cuenta (detalle, abono y facturas)
// conecta con: CreditAccountDetail, CreditAccountMetrics, CreditPaymentForm, CreditInvoiceList, CreditInvoiceCard
import type { CreditInvoice, CustomerCreditProfile } from './wallet.types'

export interface CreditAccountDetailProps {
  customer: CustomerCreditProfile
}

export interface CreditAccountMetricsProps {
  usedCredit: number
  availableCredit: number
}

export interface CreditPaymentFormProps {
  amount: string
  onAmountChange: (value: string) => void
  onSubmit: () => void
}

export interface CreditInvoiceListProps {
  invoices: CreditInvoice[]
  onPayInvoice: (invoiceId: string, amount: number) => void
}

export interface CreditInvoiceCardProps {
  invoice: CreditInvoice
  onPay: (invoiceId: string, amount: number) => void
}
