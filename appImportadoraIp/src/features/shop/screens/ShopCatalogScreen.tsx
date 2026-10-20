// ShopCatalogScreen · catálogo de repuestos: arma la barra, los filtros, el grid de tarjetas o el estado vacío
// conecta con: shop.slice, shop.selectors, ProductCard y las partes ShopCatalog*; la monta MainContent
import React from 'react'
import './ShopCatalogScreen.css'
import { useAppDispatch, useAppSelector } from '@/global/hooks/useRedux'
import { ProductCard } from '../components/productCard/ProductCard'
import { ShopCatalogToolbar } from '../components/catalog/ShopCatalogToolbar'
import { ShopCatalogFilters } from '../components/catalog/ShopCatalogFilters'
import { ShopCatalogEmpty } from '../components/catalog/ShopCatalogEmpty'
import type { PriceLevelKey, Product } from '../types/shop.types'
import { addToCart, resetFilters } from '../slices/shop.slice'
// ojo: el filtrado, las cantidades del carrito y el 'hay filtros activos' ahora salen de shop.selectors (antes eran useMemo aquí)
import {
  selectCartQuantities,
  selectFilteredProducts,
  selectHasActiveFilters,
} from '../selectors/shop.selectors'

export const ShopCatalogScreen: React.FC = () => {
  const dispatch = useAppDispatch()
  const { products, filters } = useAppSelector((state) => state.shop)
  const { activeWarehouseId, activeWarehouseName } = useAppSelector((state) => state.ui)

  // Cantidad de cada producto en el carrito (para sincronizar con ProductCard)
  const cartQuantities = useAppSelector(selectCartQuantities)

  // Filtrado reactivo de productos
  const filteredProducts = useAppSelector(selectFilteredProducts)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)

  const handleAddToCart = (
    product: Product,
    quantity: number,
    priceLevel: PriceLevelKey
  ) => {
    dispatch(addToCart({ product, quantity, priceLevel }))
  }

  return (
    <div className="shop-catalog-screen">
      {/* Barra Superior de Herramientas y Filtros */}
      <section className="shop-catalog-toolbar">
        <ShopCatalogToolbar />
        <ShopCatalogFilters resultsCount={filteredProducts.length} totalCount={products.length} />
      </section>

      {/* Grid de Productos o Estado Vacío */}
      <section className="shop-catalog-grid-section">
        {filteredProducts.length > 0 ? (
          <div className="shop-catalog-products-grid">
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
          <ShopCatalogEmpty
            warehouseName={activeWarehouseName}
            hasActiveFilters={hasActiveFilters}
            onReset={() => dispatch(resetFilters())}
          />
        )}
      </section>
    </div>
  )
}

export default ShopCatalogScreen
