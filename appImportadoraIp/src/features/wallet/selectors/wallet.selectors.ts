// wallet.selectors · lecturas derivadas del estado de cartera (KPIs y clientes filtrados)
// conecta con: WalletKpiHeader y CreditClientsTable; leen state.wallet
// ojo: antes estos cálculos estaban dentro de los componentes con useMemo; con createSelector se memorizan igual
import { createSelector } from '@reduxjs/toolkit'
import type { WalletState } from '../types/wallet.types'

// forma mínima del state que necesitan estos selectors (así la feature no importa el store de app)
type WalletRootState = { wallet: WalletState }

const selectCustomers = (state: WalletRootState) => state.wallet.customers
const selectFilters = (state: WalletRootState) => state.wallet.filters

// totales de las tarjetas de arriba: cupo, por cobrar, mora y clientes con saldo
export const selectWalletKpis = createSelector([selectCustomers], (customers) => {
  const totalLimit = customers.reduce((acc, c) => acc + c.creditLimit, 0)
  const totalReceivable = customers.reduce((acc, c) => acc + c.usedCredit, 0)
  const totalOverdue = customers
    .filter((c) => c.creditStatus === 'overdue60' || c.creditStatus === 'blocked')
    .reduce((acc, c) => acc + c.usedCredit, 0)
  const activeClients = customers.filter((c) => c.usedCredit > 0).length

  return {
    totalLimit,
    totalReceivable,
    totalOverdue,
    activeClients,
  }
})

// Filtrado reactivo de clientes (texto y estado)
export const selectFilteredCustomers = createSelector([selectCustomers, selectFilters], (customers, filters) => {
  return customers.filter((cust) => {
    // 1. Búsqueda por texto (NIT, Razón Social, Contacto, Ciudad)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim()
      const matchesDoc = cust.documentId.toLowerCase().includes(query)
      const matchesName = cust.businessName.toLowerCase().includes(query)
      const matchesContact = cust.contactName.toLowerCase().includes(query)
      const matchesCity = cust.city.toLowerCase().includes(query)
      if (!matchesDoc && !matchesName && !matchesContact && !matchesCity) {
        return false
      }
    }

    // 2. Filtro por estado
    if (filters.statusFilter !== 'all') {
      if (cust.creditStatus !== filters.statusFilter) return false
    }

    return true
  })
})

// datos del encabezado del panel derecho cuando muestra el estado de cuenta del cliente seleccionado
// ojo: antes este encabezado vivía dentro de CreditAccountDetail; ahora lo pinta el panel con estos datos
export const selectAccountDrawerMeta = createSelector(
  [selectCustomers, (state: WalletRootState) => state.wallet.selectedCustomerId],
  (customers, selectedId) => {
    const customer = customers.find((c) => c.id === selectedId)
    return customer
      ? { tag: 'Estado de cuenta', title: customer.businessName, subtitle: `NIT: ${customer.documentId}` }
      : { title: 'Estado de cuenta' }
  }
)

// true si hay un cliente seleccionado (el panel derecho solo se abre en ese caso)
export const selectHasSelectedCustomer = (state: WalletRootState) => state.wallet.selectedCustomerId !== null
