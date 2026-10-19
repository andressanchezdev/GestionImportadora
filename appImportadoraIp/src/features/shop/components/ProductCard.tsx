import React, { useState } from 'react'
import type { Product, PriceLevelKey } from '../types/shop.types'
import './ProductCard.css'

interface ProductCardProps {
    product: Product
    activeWarehouseId: string
    selectedPriceLevel: PriceLevelKey
    cartQuantity?: number
    onAddToCart: (product: Product, quantity: number, priceLevel: PriceLevelKey) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    activeWarehouseId,
    selectedPriceLevel,
    cartQuantity = 0,
    onAddToCart,
}) => {
    // Nivel de precio local editable por tarjeta (por defecto el seleccionado globalmente)
    const [cardPriceLevel, setCardPriceLevel] = useState<PriceLevelKey>(selectedPriceLevel)
    const [quantity, setQuantity] = useState<number>(1)

    // Sincronizar si cambia el nivel global (si el usuario no lo sobreescribió localmente)
    React.useEffect(() => {
        setCardPriceLevel(selectedPriceLevel)
    }, [selectedPriceLevel])

    // Stock de la bodega activa
    const warehouseStock = product.stockByWarehouse[activeWarehouseId] ?? 0
    const minAlert = product.minStockAlert ?? 5
    const isOutOfStock = warehouseStock <= 0
    const isLowStock = !isOutOfStock && warehouseStock <= minAlert

    // Obtener precio según el nivel activo en la tarjeta
    const priceKey = cardPriceLevel.toLowerCase() as keyof typeof product.prices
    const activePrice = product.prices[priceKey]

    // Formateador de moneda en pesos colombianos
    const formatCOP = (val: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(val)
    }

    const formatShortK = (val: number) => {
        return `$${Math.round(val / 1000)}k`
    }

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

    // Icono emoji según categoría para enriquecer el thumbnail
    const getCategoryEmoji = (category: string) => {
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
                <div className="product-card-stock-row">
                    {isOutOfStock ? (
                        <span className="product-stock-badge stock-out">
                            <span className="stock-dot" />
                            Agotado en bodega
                        </span>
                    ) : isLowStock ? (
                        <span className="product-stock-badge stock-low">
                            <span className="stock-dot" />
                            ¡Bajo stock! ({warehouseStock} unid.)
                        </span>
                    ) : (
                        <span className="product-stock-badge stock-in">
                            <span className="stock-dot" />
                            Disponible: {warehouseStock} unid.
                        </span>
                    )}
                </div>
            </div>

            {/* Sección de Precios Multinivel */}
            <div className="product-card-pricing">
                <div className="product-card-price-header">
                    <span className="product-card-price-main">{formatCOP(activePrice)}</span>
                    <span className="product-card-price-tier-tag">{cardPriceLevel}</span>
                </div>

                {/* Selector rápido de tarifa P0 - P3 */}
                <div className="product-card-price-breakdown">
                    {(['P0', 'P1', 'P2', 'P3'] as PriceLevelKey[]).map((level) => {
                        const lKey = level.toLowerCase() as keyof typeof product.prices
                        const isCurrent = cardPriceLevel === level
                        return (
                            <button
                                key={level}
                                type="button"
                                className={`price-tier-mini ${isCurrent ? 'active-tier' : ''}`}
                                onClick={() => setCardPriceLevel(level)}
                                title={`Tarifa ${level}: ${formatCOP(product.prices[lKey])}`}
                            >
                                <span className="tier-code">{level}</span>
                                <span className="tier-val">{formatShortK(product.prices[lKey])}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Fila de Acción: Stepper de Cantidad + Botón Ordenar */}
            <div className="product-card-action-row">
                <div className="quantity-stepper">
                    <button
                        type="button"
                        className="stepper-btn"
                        onClick={handleDecrement}
                        disabled={isOutOfStock || quantity <= 1}
                        aria-label="Disminuir cantidad"
                    >
                        -
                    </button>
                    <input
                        type="text"
                        className="stepper-input"
                        value={quantity}
                        readOnly
                        aria-label="Cantidad seleccionada"
                    />
                    <button
                        type="button"
                        className="stepper-btn"
                        onClick={handleIncrement}
                        disabled={isOutOfStock || quantity >= warehouseStock}
                        aria-label="Aumentar cantidad"
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    className={`btn-add-to-cart ${cartQuantity > 0 ? 'already-ordered' : ''}`}
                    onClick={handleAdd}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? (
                        'Sin Stock'
                    ) : cartQuantity > 0 ? (
                        <>
                            <span>✓ En Orden ({cartQuantity})</span>
                            <span style={{ opacity: 0.8, fontSize: 11 }}>+ {quantity}</span>
                        </>
                    ) : (
                        <>
                            <span>+ Ordenar</span>
                        </>
                    )}
                </button>
            </div>
        </article>
    )
}

export default ProductCard
