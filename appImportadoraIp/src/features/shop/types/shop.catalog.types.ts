// shop.catalog.types · props de las partes del catálogo (filtros y estado vacío)
// conecta con: ShopCatalogFilters y ShopCatalogEmpty (las usa ShopCatalogScreen)
export interface ShopCatalogFiltersProps {
  resultsCount: number
  totalCount: number
}

export interface ShopCatalogEmptyProps {
  warehouseName: string
  hasActiveFilters: boolean
  onReset: () => void
}
