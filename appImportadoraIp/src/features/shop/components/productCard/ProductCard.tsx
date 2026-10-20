// ProductCard · tarjeta de producto: marca, ubicación, datos del repuesto y sus tres partes (stock, precios, acciones)
// conecta con: ShopCatalogScreen (le pasa los datos y recibe el agregar al carrito); usa shop.helpers y las partes ProductCard*
import React, { useState } from 'react'
import type { PriceLevelKey } from '../../types/shop.types'
import type { ProductCardProps } from '../../types/shop.card.types'
import { getCategoryEmoji, getStockStatus, getWarehouseStock } from '../../helpers/shop.helpers'
import { ProductCardStock } from './ProductCardStock'
import { ProductCardPricing } from './ProductCardPricing'
import { ProductCardActions } from './ProductCardActions'
import './ProductCard.css'

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    activeWarehouseId,
    selectedPriceLevel,
    cartQuantity = 0,
    onAddToCart,
}) => {
    // Nivel de precio local editable por tarjeta (por defecto el seleccionado globalmente)
    // ojo: antes se sincronizaba con un useEffect; ahora el cambio local solo vale mientras el nivel global no cambie
    const [priceOverride, setPriceOverride] = useState<{ level: PriceLevelKey; from: PriceLevelKey } | null>(null)
    const [quantity, setQuantity] = useState<number>(1)
    const cardPriceLevel: PriceLevelKey =
        priceOverride && priceOverride.from === selectedPriceLevel ? priceOverride.level : selectedPriceLevel

    // Stock de la bodega activa
    const warehouseStock = getWarehouseStock(product, activeWarehouseId)
    const stockStatus = getStockStatus(warehouseStock, product.minStockAlert)
    const isOutOfStock = stockStatus === 'out_of_stock'

    const handleIncrement = () => {
        if (quantity < warehouseStock) {
            setQuantity((prev) => prev + 1)
        }
    }

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1)
        }
    }

    const handleAdd = () => {
        if (isOutOfStock) return
        onAddToCart(product, quantity, cardPriceLevel)
    }

    return (
        <article className={`product-card ${isOutOfStock ? 'product-card-out-of-stock' : ''}`}>
            {/* Barra Superior: Marca, Ubicación en Bodega */}
            <div className="product-card-top-bar">
                <span className="product-card-brand-badge">{product.brand}</span>
                {product.location && (
                    <span className="product-card-location-tag" title="Ubicación física en estantería">
                        📍 {product.location}
                    </span>
                )}
            </div>

            {/* Thumbnail visual */}
            <div className="product-card-visual">
                <span className="product-card-visual-icon">
                    {getCategoryEmoji(product.category)}
                </span>
                <span className="product-card-category-pill">{product.category}</span>
            </div>

            {/* Información del Producto */}
            <div className="product-card-info">
                <div className="product-card-sku-row">
                    <span className="product-card-code">{product.code}</span>
                    {product.barcode && (
                        <span className="product-card-barcode">BAR: {product.barcode}</span>
                    )}
                </div>

                <h4 className="product-card-name" title={product.name}>
                    {product.name}
                </h4>

                {product.modelCompatible && (
                    <div className="product-card-compat">
                        <span>🏍️</span>
                        <span>{product.modelCompatible}</span>
                    </div>
                )}

                {/* Disponibilidad de Stock */}
                <ProductCardStock status={stockStatus} stock={warehouseStock} />
            </div>

            {/* Sección de Precios Multinivel */}
            <ProductCardPricing
                product={product}
                level={cardPriceLevel}
                onLevelChange={(level) => setPriceOverride({ level, from: selectedPriceLevel })}
            />

            {/* Fila de Acción: Stepper de Cantidad + Botón Ordenar */}
            <ProductCardActions
                quantity={quantity}
                maxQuantity={warehouseStock}
                isOutOfStock={isOutOfStock}
                cartQuantity={cartQuantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onAdd={handleAdd}
            />
        </article>
    )
}

export default ProductCard
