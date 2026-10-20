// ProductCardActions · stepper de cantidad y botón de ordenar de la tarjeta
// conecta con: ProductCard (cantidad y acciones); no guarda estado, todo llega por props
import React from 'react'
import type { ProductCardActionsProps } from '../../types/shop.card.types'
import './ProductCardActions.css'

export const ProductCardActions: React.FC<ProductCardActionsProps> = ({
    quantity,
    maxQuantity,
    isOutOfStock,
    cartQuantity,
    onIncrement,
    onDecrement,
    onAdd,
}) => {
    return (
        <div className="product-card-action-row">
            <div className="product-card-quantity-stepper">
                <button
                    type="button"
                    className="product-card-stepper-btn"
                    onClick={onDecrement}
                    disabled={isOutOfStock || quantity <= 1}
                    aria-label="Disminuir cantidad"
                >
                    -
                </button>
                <input
                    type="text"
                    className="product-card-stepper-input"
                    value={quantity}
                    readOnly
                    aria-label="Cantidad seleccionada"
                />
                <button
                    type="button"
                    className="product-card-stepper-btn"
                    onClick={onIncrement}
                    disabled={isOutOfStock || quantity >= maxQuantity}
                    aria-label="Aumentar cantidad"
                >
                    +
                </button>
            </div>

            <button
                type="button"
                className={`product-card-btn-add-to-cart ${cartQuantity > 0 ? 'product-card-already-ordered' : ''}`}
                onClick={onAdd}
                disabled={isOutOfStock}
            >
                {isOutOfStock ? (
                    'Sin Stock'
                ) : cartQuantity > 0 ? (
                    <>
                        <span>✓ En Orden ({cartQuantity})</span>
                        <span className="product-card-added-qty">+ {quantity}</span>
                    </>
                ) : (
                    <span>+ Ordenar</span>
                )}
            </button>
        </div>
    )
}

export default ProductCardActions
