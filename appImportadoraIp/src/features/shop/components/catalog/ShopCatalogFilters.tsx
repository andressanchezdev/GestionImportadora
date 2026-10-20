// ShopCatalogFilters · categorías en pills y resumen de resultados ("Mostrando X de Y")
// conecta con: shop.slice (categoría seleccionada); los conteos llegan por props desde ShopCatalogScreen
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { setSelectedCategory } from '../../slices/shop.slice'
import { CATALOG_CATEGORIES } from '../../constants/shop.constants'
import type { ShopCatalogFiltersProps } from '../../types/shop.catalog.types'
import './ShopCatalogFilters.css'

export const ShopCatalogFilters: React.FC<ShopCatalogFiltersProps> = ({ resultsCount, totalCount }) => {
  const dispatch = useAppDispatch()
  const selectedCategory = useAppSelector((state) => state.shop.filters.selectedCategory)

  return (
    /* Fila 2: Filtros Rápidos (Categorías) y resumen */
    <div className="shop-catalog-filter-row">
      {/* Categorías */}
      <div className="shop-catalog-pills-group">
        <span className="shop-catalog-filters-label">Categoría:</span>
        <div className="shop-catalog-filter-pills-scroll">
          {CATALOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`shop-catalog-filter-pill ${selectedCategory === cat ? 'shop-catalog-filter-pill-active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Resumen de Resultados y Estado de Bodega */}
      <div className="shop-catalog-results-summary">
        <span className="shop-catalog-results-count">
          Mostrando <strong>{resultsCount}</strong> de{' '}
          {totalCount} repuestos
        </span>
      </div>
    </div>
  )
}

export default ShopCatalogFilters
