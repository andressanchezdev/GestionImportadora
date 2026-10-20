// ShopCatalogToolbar · fila de búsqueda: texto, marca, "con stock" y limpiar filtros
// conecta con: shop.slice (filtros), shop.selectors (hay filtros activos), global SearchBar
import React from 'react'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { SearchBar } from '@/global/components/UI/molecules/SearchBar'
import { setSearchQuery, setSelectedBrand, setOnlyInStock, resetFilters } from '../../slices/shop.slice'
import { CATALOG_BRANDS } from '../../constants/shop.constants'
import { selectHasActiveFilters } from '../../selectors/shop.selectors'
import './ShopCatalogToolbar.css'

export const ShopCatalogToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.shop.filters)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)

  return (
    /* Fila 1: Buscador Universal con marcas y toggle de stock */
    <div className="shop-catalog-search-row">
      <SearchBar
        value={filters.searchQuery}
        onChange={(val) => dispatch(setSearchQuery(val))}
        placeholder="Buscar por código (SKU), repuesto, marca o modelo de moto..."
        className="shop-catalog-search-bar"
      />
      {/* Marcas y Toggle Stock */}
      <div className="shop-catalog-controls-group">
        <div className="shop-catalog-filter-select-wrapper">
          <label htmlFor="brand-filter" className="shop-catalog-filter-group-label">
            Marca:
          </label>
          <select
            id="brand-filter"
            value={filters.selectedBrand}
            onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
            className="shop-catalog-select"
          >
            {CATALOG_BRANDS.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>
        </div>

        <label className="shop-catalog-filter-checkbox-label">
          <input
            type="checkbox"
            checked={filters.onlyInStock}
            onChange={(e) => dispatch(setOnlyInStock(e.target.checked))}
            className="shop-catalog-filter-checkbox"
          />
          <span>Con stock en bodega</span>
        </label>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="shop-catalog-reset-btn"
            title="Restablecer todos los filtros"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}

export default ShopCatalogToolbar
