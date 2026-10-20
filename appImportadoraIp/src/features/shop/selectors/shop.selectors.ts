// shop.selectors · lecturas derivadas del estado de la tienda (filtrado, cantidades y totales del carrito)
// conecta con: ShopCatalogScreen y ShopCartDrawer; leen state.shop y la bodega activa de state.ui
// ojo: antes estos cálculos estaban dentro de las pantallas con useMemo; con createSelector se memorizan igual
import { createSelector } from '@reduxjs/toolkit'
import type { NavigationState } from '@/features/navigation'
import type { ShopState } from '../types/shop.types'
import { ALL_FILTER_OPTION } from '../constants/shop.constants'
import { getWarehouseStock } from '../helpers/shop.helpers'

// forma mínima del state que necesitan estos selectors (así la feature no importa el store de app)
type ShopRootState = { shop: ShopState; ui: NavigationState }

const selectShop = (state: ShopRootState) => state.shop
const selectActiveWarehouseId = (state: ShopRootState) => state.ui.activeWarehouseId

// Cantidad de cada producto en el carrito (para sincronizar con ProductCard)
export const selectCartQuantities = createSelector([selectShop], (shop) => {
  const map: Record<string, number> = {}
  shop.cart.forEach((item) => {
    map[item.productId] = (map[item.productId] || 0) + item.quantity
  })
  return map
})

// Filtrado reactivo de productos (texto, categoría, marca y stock en la bodega activa)
export const selectFilteredProducts = createSelector(
  [selectShop, selectActiveWarehouseId],
  (shop, activeWarehouseId) => {
    const { products, filters } = shop
    return products.filter((prod) => {
      // 1. Filtro por texto (código, nombre, marca o modelo)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim()
        const matchesCode = prod.code.toLowerCase().includes(query)
        const matchesName = prod.name.toLowerCase().includes(query)
        const matchesBrand = prod.brand.toLowerCase().includes(query)
        const matchesModel = prod.modelCompatible?.toLowerCase().includes(query) ?? false
        if (!matchesCode && !matchesName && !matchesBrand && !matchesModel) {
          return false
        }
      }

      // 2. Filtro por categoría
      if (filters.selectedCategory && filters.selectedCategory !== ALL_FILTER_OPTION) {
        if (prod.category !== filters.selectedCategory) return false
      }

      // 3. Filtro por marca
      if (filters.selectedBrand && filters.selectedBrand !== ALL_FILTER_OPTION) {
        if (prod.brand !== filters.selectedBrand) return false
      }

      // 4. Filtro solo con stock en bodega activa
      if (filters.onlyInStock) {
        if (getWarehouseStock(prod, activeWarehouseId) <= 0) return false
      }

      return true
    })
  }
)

// true si hay algún filtro aplicado (para mostrar "Limpiar filtros")
export const selectHasActiveFilters = createSelector([selectShop], ({ filters }) => {
  return (
    Boolean(filters.searchQuery.trim()) ||
    filters.selectedCategory !== ALL_FILTER_OPTION ||
    filters.selectedBrand !== ALL_FILTER_OPTION ||
    filters.onlyInStock
  )
})

// totales del carrito: valor a facturar y cantidad de artículos
export const selectCartTotals = createSelector([selectShop], (shop) => ({
  totalAmount: shop.cart.reduce((acc, item) => acc + item.subtotal, 0),
  totalItemsCount: shop.cart.reduce((acc, item) => acc + item.quantity, 0),
}))

// datos del encabezado del panel derecho cuando muestra el carrito (título y cantidad de artículos)
// ojo: antes este encabezado vivía dentro de ShopCartDrawer; ahora lo pinta el panel con estos datos
export const selectCartDrawerMeta = createSelector([selectCartTotals], ({ totalItemsCount }) => ({
  title: 'Carrito POS',
  badge: `${totalItemsCount} ${totalItemsCount === 1 ? 'artículo' : 'artículos'}`,
}))
