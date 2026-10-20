// wallet.types · contratos de clientes con crédito, facturas, KPIs y filtros
// conecta con: wallet.constants, wallet.slice y los componentes de wallet
// ojo: los estados van en inglés (código), el texto que ve el cliente se arma en los componentes
// src/features/wallet/types/wallet.types.ts

export type CreditStatus = 'upToDate' | 'warning30' | 'overdue60' | 'blocked'

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
  status: 'paid' | 'current' | 'overdue'
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

export interface WalletKpis {
  totalCreditLimit: number
  totalReceivable: number // Saldo total por cobrar
  totalOverdue: number // Saldo vencido
  activeCreditClients: number // Total clientes con crédito
  totalCollectedMonth: number // Recaudado en el mes
}

export interface WalletFilters {
  searchQuery: string
  statusFilter: 'all' | CreditStatus
  cityFilter: string
}

export interface WalletState {
  customers: CustomerCreditProfile[]
  filters: WalletFilters
  selectedCustomerId: string | null
  isAccountDrawerOpen: boolean
}
