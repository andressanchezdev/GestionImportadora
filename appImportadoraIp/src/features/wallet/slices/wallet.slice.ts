// wallet.slice · estado de cartera: clientes, filtros, cliente seleccionado y abonos
// conecta con: WalletScreen, CreditClientsTable, CreditAccountDrawer
// src/features/wallet/slices/wallet.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CreditStatus } from '../types/wallet.types'
import { INITIAL_WALLET_STATE } from '../constants/wallet.constants'
import { applyPaymentToCustomer } from '../helpers/wallet.helpers'

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: INITIAL_WALLET_STATE,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<'all' | CreditStatus>) => {
      state.filters.statusFilter = action.payload
    },
    setCityFilter: (state, action: PayloadAction<string>) => {
      state.filters.cityFilter = action.payload
    },
    resetFilters: (state) => {
      state.filters = INITIAL_WALLET_STATE.filters
    },
    setSelectedCustomer: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerId = action.payload
      state.isAccountDrawerOpen = action.payload !== null
    },
    setAccountDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isAccountDrawerOpen = action.payload
      if (!action.payload) {
        state.selectedCustomerId = null
      }
    },
    registerPayment: (
      state,
      action: PayloadAction<{ customerId: string; amount: number; invoiceId?: string }>
    ) => {
      const { customerId, amount, invoiceId } = action.payload
      const customer = state.customers.find((c) => c.id === customerId)
      if (!customer) return

      // ojo: el reparto del abono ahora vive en wallet.helpers (antes estaba todo aquí)
      applyPaymentToCustomer(customer, amount, invoiceId)
    },
  },
})

export const {
  setSearchQuery,
  setStatusFilter,
  setCityFilter,
  resetFilters,
  setSelectedCustomer,
  setAccountDrawerOpen,
  registerPayment,
} = walletSlice.actions

export const walletReducer = walletSlice.reducer
export default walletSlice.reducer
