// wallet.constants · filtros iniciales, estado inicial y textos de estados de crédito
// conecta con: wallet.slice (initialState)
// src/features/wallet/constants/wallet.constants.ts
import type { CreditStatus, WalletFilters, WalletState } from '../types/wallet.types'
import { SAMPLE_CREDIT_CUSTOMERS } from '../mocks/wallet.mocks'

// etiqueta (lo que ve el cliente) y variante visual de cada estado de crédito; la variante arma la clase del badge
export const CREDIT_STATUS_BADGES: Record<CreditStatus, { variant: string; label: string }> = {
  upToDate: { variant: 'up-to-date', label: '● Al día' },
  warning30: { variant: 'warning', label: '● Alerta 30d' },
  overdue60: { variant: 'overdue', label: '● Mora >60d' },
  blocked: { variant: 'blocked', label: '● Bloqueado' },
}

// pestañas de filtro por estado en la tabla de clientes
export const CREDIT_STATUS_TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'upToDate', label: 'Al Día' },
  { key: 'warning30', label: 'Alerta (30d)' },
  { key: 'overdue60', label: 'En Mora (>60d)' },
  { key: 'blocked', label: 'Bloqueados' },
] as const

export const INITIAL_WALLET_FILTERS: WalletFilters = {
  searchQuery: '',
  statusFilter: 'all',
  cityFilter: 'Todas',
}

export const INITIAL_WALLET_STATE: WalletState = {
  customers: SAMPLE_CREDIT_CUSTOMERS,
  filters: INITIAL_WALLET_FILTERS,
  selectedCustomerId: null,
  isAccountDrawerOpen: false,
}
