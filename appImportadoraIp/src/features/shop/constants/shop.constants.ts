import type { Product, CatalogFilter, PriceLevelOption, ShopState } from '../types/shop.types'

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

export const SAMPLE_PRODUCTS: Product[] = [
    {
        id: 'PRD-101',
        code: 'REP-CIL-100',
        barcode: '770123456001',
        name: 'Kit Cilindro Completo con Pistón y Anillos Boxer CT 100',
        description: 'Kit de cilindro estándar 53mm para motor Boxer CT 100 / Platina 100.',
        brand: 'Bajaj',
        category: 'Motor',
        modelCompatible: 'Boxer CT 100 / Platina',
        location: 'Estante M-02',
        prices: {
            p0: 165000,
            p1: 152000,
            p2: 140000,
            p3: 132000,
        },
        stockByWarehouse: {
            'WH-01': 18,
            'WH-02': 6,
        },
        minStockAlert: 5,
    },
    {
        id: 'PRD-102',
        code: 'REP-PAS-200',
        barcode: '770123456002',
        name: 'Pastillas de Freno Delanteras Cerámicas Pulsar NS 200',
        description: 'Juego de pastillas de alto coeficiente de fricción para freno de disco.',
        brand: 'Bajaj',
        category: 'Frenos',
        modelCompatible: 'Pulsar NS 200 / RS 200',
        location: 'Estante F-01',
        prices: {
            p0: 28000,
            p1: 24000,
            p2: 21000,
            p3: 18500,
        },
        stockByWarehouse: {
            'WH-01': 42,
            'WH-02': 15,
        },
        minStockAlert: 10,
    },
    {
        id: 'PRD-103',
        code: 'REP-ARR-160',
        barcode: '770123456003',
        name: 'Kit de Arrastre Reforzado FZ 16 Corona 40T Piñón 14T',
        description: 'Relación 40/14T con cadena reforzada dorada paso 428H x 132L.',
        brand: 'Yamaha',
        category: 'Transmisión',
        modelCompatible: 'FZ 16 / FZ 2.0',
        location: 'Estante T-05',
        prices: {
            p0: 98000,
            p1: 89000,
            p2: 82000,
            p3: 75000,
        },
        stockByWarehouse: {
            'WH-01': 12,
            'WH-02': 4,
        },
        minStockAlert: 4,
    },
    {
        id: 'PRD-104',
        code: 'REP-BUJ-701',
        barcode: '770123456004',
        name: 'Bujía de Encendido Iridium NGK CR7HIX',
        description: 'Bujía de punta fina de iridio para encendido eficiente y ahorro de combustible.',
        brand: 'Honda',
        category: 'Eléctrico',
        modelCompatible: 'Wave 110 / C100 Wave / Eco Deluxe',
        location: 'Estante E-03',
        prices: {
            p0: 38000,
            p1: 34000,
            p2: 30000,
            p3: 27000,
        },
        stockByWarehouse: {
            'WH-01': 60,
            'WH-02': 25,
        },
        minStockAlert: 15,
    },
    {
        id: 'PRD-105',
        code: 'REP-BAT-125',
        barcode: '770123456005',
        name: 'Batería Gel Sellada 12V 5Ah Libre Mantenimiento',
        description: 'Batería activada en fábrica con tecnología de gel para arranque instantáneo.',
        brand: 'AKT',
        category: 'Eléctrico',
        modelCompatible: 'AKT 125 NKD / CR4 125',
        location: 'Estante E-01',
        prices: {
            p0: 85000,
            p1: 78000,
            p2: 72000,
            p3: 65000,
        },
        stockByWarehouse: {
            'WH-01': 14,
            'WH-02': 0,
        },
        minStockAlert: 5,
    },
    {
        id: 'PRD-106',
        code: 'REP-AMO-125',
        barcode: '770123456006',
        name: 'Amortiguadores Traseros Hidráulicos Cromados GN 125 (Par)',
        description: 'Par de amortiguadores reforzados ajustables en 5 posiciones.',
        brand: 'Suzuki',
        category: 'Suspensión',
        modelCompatible: 'GN 125 / GS 125',
        location: 'Estante S-02',
        prices: {
            p0: 120000,
            p1: 110000,
            p2: 102000,
            p3: 94000,
        },
        stockByWarehouse: {
            'WH-01': 8,
            'WH-02': 2,
        },
        minStockAlert: 3,
    },
    {
        id: 'PRD-107',
        code: 'REP-CLU-100',
        barcode: '770123456007',
        name: 'Discos de Clutch Embrague en Baquelita Boxer BM 100 (Juego x5)',
        description: 'Juego de 5 discos de fricción resistentes a altas temperaturas.',
        brand: 'Bajaj',
        category: 'Motor',
        modelCompatible: 'Boxer BM 100 / CT 100',
        location: 'Estante M-04',
        prices: {
            p0: 32000,
            p1: 28000,
            p2: 25000,
            p3: 22000,
        },
        stockByWarehouse: {
            'WH-01': 26,
            'WH-02': 10,
        },
        minStockAlert: 8,
    },
    {
        id: 'PRD-108',
        code: 'REP-FIL-155',
        barcode: '770123456008',
        name: 'Elemento Filtro de Aire Lavable Alto Flujo NMAX 155',
        description: 'Filtro de aire de celulosa microporosa para scooter de inyección electrónica.',
        brand: 'Yamaha',
        category: 'Motor',
        modelCompatible: 'NMAX 155 / Aerox 155',
        location: 'Estante M-07',
        prices: {
            p0: 24000,
            p1: 21000,
            p2: 18500,
            p3: 16500,
        },
        stockByWarehouse: {
            'WH-01': 0, // Agotado para probar estados visuales de stock
            'WH-02': 0,
        },
        minStockAlert: 6,
    },
]

export const INITIAL_SHOP_STATE: ShopState = {
    products: SAMPLE_PRODUCTS,
    filters: INITIAL_CATALOG_FILTERS,
    cart: [],
    selectedProductId: null,
    isCartDrawerOpen: false,
}
