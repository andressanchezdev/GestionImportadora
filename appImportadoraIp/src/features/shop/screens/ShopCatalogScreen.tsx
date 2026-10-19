import React, { useMemo } from 'react'
import './ShopCatalogScreen.css'
import { useAppDispatch, useAppSelector } from '@/app/store/store'
import { SearchBar } from '@/global/components/UI/molecules/SearchBar'
import { ProductCard } from '../components/ProductCard'
import type { PriceLevelKey, Product } from '../types/shop.types'
import {
  setSearchQuery,
  setSelectedCategory,
  setSelectedBrand,
  setOnlyInStock,
  resetFilters,
  addToCart,
} from '../slices/shop.slice'
import {
  CATALOG_CATEGORIES,
  CATALOG_BRANDS,
} from '../constants/shop.constants'

export const ShopCatalogScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products, filters, cart } = useAppSelector((state) => state.shop)
  const { activeWarehouseId, activeWarehouseName } = useAppSelector((state) => state.ui)

  // Cantidad de cada producto en el carrito (para sincronizar con ProductCard)
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {}
    cart.forEach((item) => {
      map[item.productId] = (map[item.productId] || 0) + item.quantity
    })
    return map
  }, [cart])

  // Filtrado reactivo de productos
  const filteredProducts = useMemo(() => {
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
      if (filters.selectedCategory && filters.selectedCategory !== 'Todas') {
        if (prod.category !== filters.selectedCategory) return false
      }

      // 3. Filtro por marca
      if (filters.selectedBrand && filters.selectedBrand !== 'Todas') {
        if (prod.brand !== filters.selectedBrand) return false
      }

      // 4. Filtro solo con stock en bodega activa
      if (filters.onlyInStock) {
        const stock = prod.stockByWarehouse[activeWarehouseId] ?? 0
        if (stock <= 0) return false
      }

      return true
    })
  }, [products, filters, activeWarehouseId])

  const handleAddToCart = (
    product: Product,
    quantity: number,
    priceLevel: PriceLevelKey
  ) => {
    dispatch(addToCart({ product, quantity, priceLevel }))
  }

  const hasActiveFilters =
    Boolean(filters.searchQuery.trim()) ||
    filters.selectedCategory !== 'Todas' ||
    filters.selectedBrand !== 'Todas' ||
    filters.onlyInStock

  return (
    <div className="shop-catalog-screen">
      {/* Barra Superior de Herramientas y Filtros */}
      <section className="catalog-toolbar">
        {/* Fila 1: Buscador Universal con selector de nivel de precio en su slot */}
        <div className="catalog-search-row">
          <SearchBar
            value={filters.searchQuery}
            onChange={(val) => dispatch(setSearchQuery(val))}
            placeholder="Buscar por código (SKU), repuesto, marca o modelo de moto..."
            className="catalog-search-bar"
          />
          {/* Marcas y Toggle Stock */}
          <div className="catalog-controls-group">
            <div className="filter-select-wrapper">
              <label htmlFor="brand-filter" className="filter-group-label">
                Marca:
              </label>
              <select
                id="brand-filter"
                value={filters.selectedBrand}
                onChange={(e) => dispatch(setSelectedBrand(e.target.value))}
                className="catalog-select"
              >
                {CATALOG_BRANDS.map((br) => (
                  <option key={br} value={br}>
                    {br}
                  </option>
                ))}
              </select>
            </div>

            <label className="filter-checkbox-label">
              <input
                type="checkbox"
                checked={filters.onlyInStock}
                onChange={(e) => dispatch(setOnlyInStock(e.target.checked))}
                className="filter-checkbox"
              />
              <span>Con stock en bodega</span>
            </label>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => dispatch(resetFilters())}
                className="catalog-reset-btn"
                title="Restablecer todos los filtros"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Fila 2: Filtros Rápidos (Categorías, Marcas, Stock) */}
        <div className="catalog-filter-row">
          {/* Categorías */}
          <div className="catalog-pills-group">
            <span className="filter-group-label">Categoría:</span>
            <div className="filter-pills-scroll">
              {CATALOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => dispatch(setSelectedCategory(cat))}
                  className={`filter-pill ${filters.selectedCategory === cat ? 'filter-pill-active' : ''
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {/* Resumen de Resultados y Estado de Bodega */}
          <div className="catalog-results-summary">
            <span className="results-count">
              Mostrando <strong>{filteredProducts.length}</strong> de{' '}
              {products.length} repuestos
            </span>
          </div>
        </div>
      </section>

      {/* Grid de Productos o Estado Vacío */}
      <section className="catalog-grid-section">
        {filteredProducts.length > 0 ? (
          <div className="catalog-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                activeWarehouseId={activeWarehouseId}
                selectedPriceLevel={filters.priceLevel}
                cartQuantity={cartQuantities[product.id] || 0}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No se encontraron repuestos</h3>
            <p className="empty-state-desc">
              No hay productos que coincidan con los filtros aplicados en{' '}
              <strong>{activeWarehouseName}</strong>.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => dispatch(resetFilters())}
                className="empty-state-btn"
              >
                Restablecer búsqueda y filtros
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default ShopCatalogScreen
