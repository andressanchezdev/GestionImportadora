// shop.helpers · funciones puras de la tienda (stock, precio por nivel y emoji de categoría)
// conecta con: ProductCard (los usa para pintar) y shop.selectors
// ojo: estas funciones antes estaban dentro de ProductCard.tsx
import type { PriceLevelKey, Product, ProductStockStatus } from '../types/shop.types'

// stock de un producto en una bodega (0 si no hay dato de esa bodega)
export const getWarehouseStock = (product: Product, warehouseId: string): number => {
  return product.stockByWarehouse[warehouseId] ?? 0
}

// estado del stock: agotado, bajo (<= alerta mínima, 5 por defecto) o disponible
export const getStockStatus = (stock: number, minAlert: number = 5): ProductStockStatus => {
  if (stock <= 0) return 'out_of_stock'
  if (stock <= minAlert) return 'low_stock'
  return 'in_stock'
}

// precio del producto según el nivel activo (P0 mostrador ... P3 mayorista)
export const getPriceByLevel = (product: Product, level: PriceLevelKey): number => {
  const key = level.toLowerCase() as keyof Product['prices']
  return product.prices[key]
}

// emoji según la categoría, para enriquecer el thumbnail de la tarjeta
export const getCategoryEmoji = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'motor':
      return '⚙️'
    case 'frenos':
      return '🛑'
    case 'transmisión':
      return '⛓️'
    case 'eléctrico':
      return '⚡'
    case 'suspensión':
      return '🔩'
    default:
      return '📦'
  }
}
