// shop.card.types · props de la tarjeta de producto y de sus partes (stock, precios y acciones)
// conecta con: ProductCard, ProductCardStock, ProductCardPricing, ProductCardActions
// ojo: ProductCardProps antes estaba en shop.types; se separó para que ese archivo no crezca
import type { PriceLevelKey, Product, ProductStockStatus } from './shop.types'

export interface ProductCardProps {
    product: Product
    activeWarehouseId: string
    selectedPriceLevel: PriceLevelKey
    cartQuantity?: number
    onAddToCart: (product: Product, quantity: number, priceLevel: PriceLevelKey) => void
}

export interface ProductCardStockProps {
    status: ProductStockStatus
    stock: number
}

export interface ProductCardPricingProps {
    product: Product
    level: PriceLevelKey
    onLevelChange: (level: PriceLevelKey) => void
}

export interface ProductCardActionsProps {
    quantity: number
    maxQuantity: number
    isOutOfStock: boolean
    cartQuantity: number
    onIncrement: () => void
    onDecrement: () => void
    onAdd: () => void
}
