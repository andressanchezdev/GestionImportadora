export type PriceLevelKey = 'P0' | 'P1' | 'P2' | 'P3'

export interface ProductPrices {
    p0: number // Mostrador / Público general
    p1: number // Taller / Mecánico
    p2: number // Distribuidor / Almacén
    p3: number // Mayorista especial
}

export interface PriceLevelOption {
    key: PriceLevelKey
    label: string
    description: string
    badgeColor?: string
}

export type ProductStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export interface Product {
    id: string
    code: string // SKU o Código interno (ej. REP-CIL-100)
    barcode?: string // Código de barras para lector POS
    name: string
    description?: string
    brand: string // Marca (ej. Bajaj, Yamaha, Honda, AKT, Suzuki)
    category: string // Categoría (ej. Motor, Frenos, Transmisión, Eléctrico, Suspensión)
    modelCompatible?: string // Modelo de moto (ej. Boxer CT 100, Pulsar NS 200, FZ 16)
    imageUrl?: string
    location?: string // Ubicación física en estantería (ej. Estante M-04)
    prices: ProductPrices
    stockByWarehouse: Record<string, number> // Stock mapeado por ID de bodega (ej. 'WH-01': 15)
    minStockAlert?: number // Límite para disparar alerta de stock bajo
}

export interface CatalogFilter {
    searchQuery: string
    selectedCategory: string
    selectedBrand: string
    onlyInStock: boolean
    priceLevel: PriceLevelKey
}

export interface CartItem {
    productId: string
    product: Product
    quantity: number
    selectedPrice: number
    priceLevel: PriceLevelKey
    subtotal: number
}

export interface ShopState {
    products: Product[]
    filters: CatalogFilter
    cart: CartItem[]
    selectedProductId: string | null
    isCartDrawerOpen: boolean
}
