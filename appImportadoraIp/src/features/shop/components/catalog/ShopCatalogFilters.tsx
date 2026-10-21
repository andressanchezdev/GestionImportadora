// ShopCatalogFilters · categorías en pills y resumen de resultados ("Mostrando X de Y")
// conecta con: shop.slice (categoría seleccionada), catalogs (categorías del backend); los conteos llegan por props desde ShopCatalogScreen
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { setSelectedCategory } from '../../slices/shop.slice'
import { selectCategories } from '@/features/catalogs'
import { ALL_FILTER_OPTION } from '../../constants/shop.constants'
import type { ShopCatalogFiltersProps } from '../../types/shop.catalog.types'
import './ShopCatalogFilters.css'

export const ShopCatalogFilters: React.FC<ShopCatalogFiltersProps> = ({ resultsCount, totalCount }) => {
  const dispatch = useAppDispatch()
  const selectedCategoryId = useAppSelector((state) => state.shop.filters.selectedCategoryId)
  const categories = useAppSelector(selectCategories)

  return (
    /* Fila 2: Filtros Rápidos (Categorías) y resumen */
    <div className="shop-catalog-filter-row">
      {/* Categoría con el mismo diseño del selector de Marca (shop-catalog-filter-select-wrapper) */}
      <div className="shop-catalog-filter-select-wrapper">
        <label htmlFor="category-filter" className="shop-catalog-filter-group-label">
          Categoría:
        </label>
        <select
          id="category-filter"
          value={selectedCategoryId ?? ''}
          onChange={(e) => dispatch(setSelectedCategory(e.target.value === '' ? null : Number(e.target.value)))}
          className="shop-catalog-select"
        >
          {/* ojo: el valor de cada opción es el id de la categoría; 'Todas' es el valor vacío */}
          <option value="">{ALL_FILTER_OPTION}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
