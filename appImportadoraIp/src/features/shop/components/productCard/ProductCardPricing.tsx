// ProductCardPricing · precio del nivel activo y selector rápido de tarifa P0 - P3
// conecta con: ProductCard (nivel y cambio de nivel); formatos de global/helpers/format
import React from 'react'
import { formatCOP, formatShortK } from '@/global/helpers/format'
import { getPriceByLevel } from '../../helpers/shop.helpers'
import { PRICE_LEVEL_OPTIONS } from '../../constants/shop.constants'
import type { ProductCardPricingProps } from '../../types/shop.card.types'
import './ProductCardPricing.css'

export const ProductCardPricing: React.FC<ProductCardPricingProps> = ({ product, level, onLevelChange }) => {
    return (
        <div className="product-card-pricing">
            <div className="product-card-price-header">
                <span className="product-card-price-main">{formatCOP(getPriceByLevel(product, level))}</span>
                <span className="product-card-price-tier-tag">{level}</span>
            </div>

            {/* Selector rápido de tarifa P0 - P3 */}
            <div className="product-card-price-breakdown">
                {PRICE_LEVEL_OPTIONS.map(({ key }) => {
                    const price = getPriceByLevel(product, key)
                    return (
                        <button
                            key={key}
                            type="button"
                            className={`product-card-price-tier-mini ${level === key ? 'product-card-active-tier' : ''}`}
                            onClick={() => onLevelChange(key)}
                            title={`Tarifa ${key}: ${formatCOP(price)}`}
                        >
                            <span className="product-card-tier-code">{key}</span>
                            <span className="product-card-tier-val">{formatShortK(price)}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ProductCardPricing
