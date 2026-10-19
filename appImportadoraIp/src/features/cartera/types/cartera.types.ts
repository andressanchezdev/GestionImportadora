// src/features/cartera/types/cartera.types.ts

export type CreditStatus = 'al_dia' | 'alerta_30' | 'mora_60' | 'bloqueado'

export interface CreditInvoice {
  id: string
  invoiceNumber: string // ej. FAC-2026-0891
  orderNumber: string // ej. PD-4012
  issueDate: string
  dueDate: string
  totalAmount: number
  paidAmount: number
  pendingBalance: number
  daysOverdue: number
  status: 'pagada' | 'vigente' | 'vencida'
}

export interface CustomerCreditProfile {
  id: string
  documentId: string // NIT o Cédula (ej. 900.542.118-3)
  businessName: string // Nombre o Razón Social (ej. Motos y Repuestos El Poblado S.A.S)
  contactName: string
  phone: string
  email: string
  city: string
  address: string
  creditLimit: number // Cupo total asignado en COP
  usedCredit: number // Saldo utilizado
  availableCredit: number // Cupo disponible (creditLimit - usedCredit)
  creditStatus: CreditStatus
  lastPaymentDate?: string
  lastPaymentAmount?: number
  invoices: CreditInvoice[]
}

export interface CarteraKPIs {
  totalCreditLimit: number
  totalReceivable: number // Saldo total por cobrar
  totalOverdue: number // Saldo vencido
  activeCreditClients: number // Total clientes con crédito
  totalCollectedMonth: number // Recaudado en el mes
}

export interface CarteraFilters {
  searchQuery: string
  statusFilter: 'todos' | CreditStatus
  cityFilter: string
}

export interface CarteraState {
  customers: CustomerCreditProfile[]
  filters: CarteraFilters
  selectedCustomerId: string | null
  isAccountDrawerOpen: boolean
}
