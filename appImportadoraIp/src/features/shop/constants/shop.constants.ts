// shop.constants · categorías, marcas, niveles de precio, filtros y estado inicial
// conecta con: shop.slice (initialState), ShopCatalogScreen
import type { CatalogFilter, PriceLevelOption, ShopState } from '../types/shop.types'
import { SAMPLE_PRODUCTS } from '../mocks/shop.mocks'

// opción que significa 'sin filtro' en categoría y marca (la usan los selectors y la pantalla)
export const ALL_FILTER_OPTION = 'Todas'

export const CATALOG_CATEGORIES: string[] = [
    'Todas',
    'Motor',
    'Frenos',
    'Transmisión',
    'Eléctrico',
    'Suspensión',
    'Accesorios',
]

export const CATALOG_BRANDS: string[] = [
    'Todas',
    'Bajaj',
    'Yamaha',
    'Honda',
    'AKT',
    'Suzuki',
    'TVS',
]

export const PRICE_LEVEL_OPTIONS: PriceLevelOption[] = [
    { key: 'P0', label: 'P0 · Mostrador', description: 'Precio al detal / público' },
    { key: 'P1', label: 'P1 · Taller', description: 'Precio mecánico / taller' },
    { key: 'P2', label: 'P2 · Distribuidor', description: 'Precio almacén de repuestos' },
    { key: 'P3', label: 'P3 · Mayorista', description: 'Precio mayorista especial' },
]

export const INITIAL_CATALOG_FILTERS: CatalogFilter = {
    searchQuery: '',
    selectedCategory: 'Todas',
    selectedBrand: 'Todas',
    onlyInStock: false,
    priceLevel: 'P0',
}

export const INITIAL_SHOP_STATE: ShopState = {
    products: SAMPLE_PRODUCTS,
    filters: INITIAL_CATALOG_FILTERS,
    cart: [],
    selectedProductId: null,
    isCartDrawerOpen: false,
}
