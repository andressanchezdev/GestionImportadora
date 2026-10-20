// warehouse.types · contrato de bodega
// conecta con: warehouses.constants
export interface Warehouse {
    id: string
    name: string
    code?: string
    isDefault?: boolean
}
