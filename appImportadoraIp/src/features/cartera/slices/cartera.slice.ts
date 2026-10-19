// src/features/cartera/slices/cartera.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CreditStatus } from '../types/cartera.types'
import { INITIAL_CARTERA_STATE } from '../constants/cartera.constants'

export const carteraSlice = createSlice({
  name: 'cartera',
  initialState: INITIAL_CARTERA_STATE,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload
    },
    setStatusFilter: (state, action: PayloadAction<'todos' | CreditStatus>) => {
      state.filters.statusFilter = action.payload
    },
    setCityFilter: (state, action: PayloadAction<string>) => {
      state.filters.cityFilter = action.payload
    },
    resetFilters: (state) => {
      state.filters = INITIAL_CARTERA_STATE.filters
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
            inv.status = 'pagada'
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
              inv.status = 'pagada'
            }
          }
        }
      }

      // Reevaluar estado del cliente si ya saldó la mora
      const hasOverdue = customer.invoices.some((i) => i.status === 'vencida' && i.pendingBalance > 0)
      if (!hasOverdue) {
        customer.creditStatus = 'al_dia'
      }
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
} = carteraSlice.actions

export const carteraReducer = carteraSlice.reducer
export default carteraSlice.reducer
